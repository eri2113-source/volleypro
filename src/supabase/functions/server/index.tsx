import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from './kv_store.tsx';
import livekitRoutes from './livekit.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// ============= MASTER USER CONFIGURATION =============
const MASTER_EMAIL = 'eri.2113@gmail.com';

// Check if user is master
async function isMasterUser(userId: string): Promise<boolean> {
  try {
    const user = await kv.get(`user:${userId}`);
    if (!user) return false;
    
    // Check if email matches master email
    const { data: authUser } = await supabase.auth.admin.getUserById(userId);
    return authUser?.user?.email === MASTER_EMAIL;
  } catch (error) {
    console.error('Error checking master user:', error);
    return false;
  }
}

// Initialize storage bucket for avatars on startup
async function initStorage() {
  try {
    const bucketName = 'make-0ea22bba-avatars';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log('📦 Creating avatars bucket...');
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      });
      
      // Ignorar erro se bucket já existe (race condition)
      if (error && error.statusCode !== '409') {
        console.error('❌ Error creating bucket:', error);
      } else {
        console.log('✅ Avatars bucket created successfully');
      }
    } else {
      console.log('✅ Avatars bucket already exists');
    }
  } catch (error: any) {
    // Ignorar erro se bucket já existe
    if (error?.statusCode !== '409' && !error?.message?.includes('already exists')) {
      console.error('❌ Error initializing storage:', error);
    } else {
      console.log('✅ Avatars bucket already exists (caught in catch)');
    }
  }
}

// Initialize on startup
initStorage();

// Auth middleware (required auth)
async function authMiddleware(c: any, next: any) {
  const authHeader = c.req.header('Authorization');
  console.log('🔐 Auth Header:', authHeader ? `Bearer ${authHeader.substring(7, 20)}...` : 'Missing');
  
  const accessToken = authHeader?.split(' ')[1];
  
  // Se não tem token, tentar usar o anon key (não autenticado)
  if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
    console.log('❌ No valid access token provided');
    return c.json({ error: 'Unauthorized - No token provided' }, 401);
  }
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error) {
      // Apenas logar se não for erro de sessão (comum e esperado)
      if (!error.message?.includes('session missing')) {
        console.error('❌ Auth error:', error.message);
      }
      // Retornar erro específico para o frontend saber que precisa refresh
      return c.json({ 
        error: `Unauthorized - ${error.message}`,
        code: 'TOKEN_INVALID',
        needsRefresh: true 
      }, 401);
    }
    
    if (!user) {
      console.log('❌ No user found for token');
      return c.json({ 
        error: 'Unauthorized - Invalid token',
        code: 'USER_NOT_FOUND',
        needsRefresh: true 
      }, 401);
    }
    
    console.log('✅ User authenticated:', user.email);
    c.set('userId', user.id);
    c.set('userEmail', user.email);
    await next();
  } catch (error: any) {
    console.error('❌ Auth middleware error:', error);
    return c.json({ 
      error: 'Unauthorized - Server error',
      code: 'SERVER_ERROR',
      needsRefresh: true 
    }, 401);
  }
}

// Optional auth middleware (allows public access but validates token if provided)
async function optionalAuthMiddleware(c: any, next: any) {
  const authHeader = c.req.header('Authorization');
  const accessToken = authHeader?.split(' ')[1];
  
  // Se não tem token ou é anon key, permitir acesso público
  if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
    console.log('📖 Public access - no authentication');
    c.set('userId', null);
    c.set('userEmail', null);
    await next();
    return;
  }
  
  // Se tem token, tentar validar
  try {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!error && user) {
      console.log('✅ Authenticated user:', user.email);
      c.set('userId', user.id);
      c.set('userEmail', user.email);
    } else {
      console.log('⚠️ Invalid token, allowing public access');
      c.set('userId', null);
      c.set('userEmail', null);
    }
  } catch (error: any) {
    console.log('⚠️ Auth error, allowing public access:', error.message);
    c.set('userId', null);
    c.set('userEmail', null);
  }
  
  await next();
}

// ============= AUTH ROUTES =============

app.post('/make-server-0ea22bba/auth/signup', async (c) => {
  try {
    const { email, password, name, userType, position, city, nickname } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since email server hasn't been configured
      user_metadata: { name, userType },
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Create user profile in KV store
    const profile = {
      id: data.user.id,
      email,
      name,
      userType, // 'athlete', 'team', or 'fan'
      nickname: nickname || null,
      position: position || null,
      city: city || null,
      bio: null,
      photoUrl: null,
      verified: false,
      followers: 0,
      following: 0,
      achievements: [], // ← Inicializar como array vazio
      // Campos específicos de atletas
      dateOfBirth: null,
      gender: null,
      height: null,
      weight: null,
      currentTeam: null,
      teamHistory: null,
      freeAgent: false, // ← Não está disponível no mercado por padrão
      cpf: null,
      // Campos específicos de times
      teamMembers: [], // ← Array vazio para membros do time
      founded: null,
      championships: 0,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`user:${data.user.id}`, profile);

    return c.json({ user: data.user, profile });
  } catch (error: any) {
    console.log('Error in signup route:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= USER/PROFILE ROUTES =============

// Get current user's profile
app.get('/make-server-0ea22bba/users/me', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const profile = await kv.get(`user:${userId}`);
    
    if (!profile) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json({ profile });
  } catch (error: any) {
    console.log('Error fetching current user profile:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.get('/make-server-0ea22bba/users/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    console.log('🔍 Buscando perfil público do usuário:', userId);
    
    let profile = await kv.get(`user:${userId}`);
    
    if (!profile) {
      console.log('❌ Usuário não encontrado:', userId);
      return c.json({ error: 'User not found' }, 404);
    }
    
    // 🔧 MIGRAÇÃO AUTOMÁTICA: Garantir que campos obrigatórios existam
    let needsUpdate = false;
    
    if (profile.followers === undefined || profile.followers === null) {
      console.log('⚠️ Perfil sem campo followers, adicionando...');
      profile.followers = 0;
      needsUpdate = true;
    }
    
    if (profile.following === undefined || profile.following === null) {
      console.log('⚠️ Perfil sem campo following, adicionando...');
      profile.following = 0;
      needsUpdate = true;
    }
    
    if (!Array.isArray(profile.achievements)) {
      console.log('⚠️ Perfil com achievements inválido, corrigindo...');
      profile.achievements = [];
      needsUpdate = true;
    }
    
    if (profile.userType === 'team' && !Array.isArray(profile.teamMembers)) {
      console.log('⚠️ Time sem teamMembers, adicionando...');
      profile.teamMembers = [];
      needsUpdate = true;
    }
    
    // Salvar se houve migração
    if (needsUpdate) {
      await kv.set(`user:${userId}`, profile);
      console.log('✅ Perfil migrado automaticamente');
    }
    
    console.log('✅ Perfil encontrado:', profile.name || profile.nickname);
    console.log('📊 Followers:', profile.followers, '| Following:', profile.following);
    
    // Retornar dados públicos (sem email e outras infos sensíveis)
    const publicProfile = {
      id: profile.id,
      name: profile.name,
      full_name: profile.name,
      nickname: profile.nickname,
      user_type: profile.userType,
      userType: profile.userType,
      position: profile.position,
      city: profile.city,
      location: profile.city,
      bio: profile.bio,
      description: profile.bio,
      photo_url: profile.photoUrl,
      photoUrl: profile.photoUrl,
      verified: profile.verified,
      followers: profile.followers || 0,
      following: profile.following || 0,
      // Campos específicos de atleta
      age: profile.age,
      height: profile.height,
      weight: profile.weight,
      date_of_birth: profile.dateOfBirth,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender,
      current_team: profile.currentTeam,
      currentTeam: profile.currentTeam,
      team: profile.currentTeam,
      // Garantir que achievements seja sempre um array
      achievements: Array.isArray(profile.achievements) ? profile.achievements : [],
      // Campos específicos de time
      founded: profile.founded,
      founded_year: profile.founded,
      team_name: profile.name,
      championships: profile.championships || 0,
      // Garantir que teamMembers/players seja sempre um array
      team_members: Array.isArray(profile.teamMembers) ? profile.teamMembers : [],
      teamMembers: Array.isArray(profile.teamMembers) ? profile.teamMembers : [],
      players: Array.isArray(profile.teamMembers) ? profile.teamMembers : [],
      // Campos de fã
      favorite_team: profile.favoriteTeam,
      favoriteTeam: profile.favoriteTeam,
      favorite_player: profile.favoritePlayer,
      favoritePlayer: profile.favoritePlayer,
    };
    
    return c.json(publicProfile);
  } catch (error: any) {
    console.error('❌ Error fetching user by ID:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.put('/make-server-0ea22bba/users/:userId', authMiddleware, async (c) => {
  try {
    const userId = c.req.param('userId');
    const currentUserId = c.get('userId');
    
    if (userId !== currentUserId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    const updates = await c.req.json();
    const profile = await kv.get(`user:${userId}`);
    
    if (!profile) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Garantir que altura e peso sejam números se fornecidos
    if (updates.height !== undefined && updates.height !== null) {
      updates.height = typeof updates.height === 'number' ? updates.height : parseInt(updates.height) || null;
    }
    if (updates.weight !== undefined && updates.weight !== null) {
      updates.weight = typeof updates.weight === 'number' ? updates.weight : parseFloat(updates.weight) || null;
    }
    
    const updatedProfile = { ...profile, ...updates };
    await kv.set(`user:${userId}`, updatedProfile);
    
    console.log('✅ Profile updated with height:', updatedProfile.height, 'weight:', updatedProfile.weight);
    
    return c.json({ profile: updatedProfile });
  } catch (error: any) {
    console.log('Error updating user profile:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.get('/make-server-0ea22bba/users', async (c) => {
  try {
    const userType = c.req.query('type'); // 'athlete' or 'team'
    const position = c.req.query('position');
    
    let users = await kv.getByPrefix('user:');
    
    // 🔧 MIGRAÇÃO AUTOMÁTICA: Garantir que todos os usuários tenham followers/following
    let migratedCount = 0;
    for (let i = 0; i < users.length; i++) {
      let user = users[i];
      let needsUpdate = false;
      
      if (user.followers === undefined || user.followers === null) {
        user.followers = 0;
        needsUpdate = true;
      }
      
      if (user.following === undefined || user.following === null) {
        user.following = 0;
        needsUpdate = true;
      }
      
      if (!Array.isArray(user.achievements)) {
        user.achievements = [];
        needsUpdate = true;
      }
      
      if (user.userType === 'team' && !Array.isArray(user.teamMembers)) {
        user.teamMembers = [];
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await kv.set(`user:${user.id}`, user);
        migratedCount++;
      }
      
      users[i] = user;
    }
    
    if (migratedCount > 0) {
      console.log(`✅ Migrados ${migratedCount} perfis automaticamente`);
    }
    
    let filteredUsers = users;
    
    if (userType) {
      filteredUsers = filteredUsers.filter((u: any) => u.userType === userType);
    }
    
    if (position) {
      filteredUsers = filteredUsers.filter((u: any) => u.position === position);
    }
    
    return c.json({ users: filteredUsers });
  } catch (error: any) {
    console.log('Error listing users:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= POSTS ROUTES =============

app.post('/make-server-0ea22bba/posts', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const { content, mediaType, mediaUrl } = await c.req.json();
    
    const userProfile = await kv.get(`user:${userId}`);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }
    
    const postId = crypto.randomUUID();
    const post = {
      id: postId,
      authorId: userId,
      authorName: userProfile.nickname || userProfile.name,
      authorPhotoUrl: userProfile.photoUrl || null,
      authorType: userProfile.userType,
      verified: userProfile.verified,
      content,
      mediaType: mediaType || null,
      mediaUrl: mediaUrl || null,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`post:${postId}`, post);
    
    return c.json({ post });
  } catch (error: any) {
    console.log('Error creating post:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.get('/make-server-0ea22bba/posts', optionalAuthMiddleware, async (c) => {
  try {
    const posts = await kv.getByPrefix('post:');
    const sortedPosts = posts.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json({ posts: sortedPosts });
  } catch (error: any) {
    console.log('Error fetching posts:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.post('/make-server-0ea22bba/posts/:postId/like', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const postId = c.req.param('postId');
    const likeKey = `like:${postId}:${userId}`;
    
    const existingLike = await kv.get(likeKey);
    
    if (existingLike) {
      // Unlike
      await kv.del(likeKey);
      const post = await kv.get(`post:${postId}`);
      if (post) {
        post.likes = Math.max(0, post.likes - 1);
        await kv.set(`post:${postId}`, post);
      }
      return c.json({ liked: false, likes: post.likes });
    } else {
      // Like
      await kv.set(likeKey, { userId, postId, createdAt: new Date().toISOString() });
      const post = await kv.get(`post:${postId}`);
      if (post) {
        post.likes = post.likes + 1;
        await kv.set(`post:${postId}`, post);
      }
      return c.json({ liked: true, likes: post.likes });
    }
  } catch (error: any) {
    console.log('Error liking post:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= COMMENTS ROUTES =============

// Get comments for a post
app.get('/make-server-0ea22bba/posts/:postId/comments', optionalAuthMiddleware, async (c) => {
  try {
    const postId = c.req.param('postId');
    const comments = await kv.getByPrefix(`comment:${postId}:`);
    
    // Sort by date (newest first)
    const sortedComments = comments.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json({ comments: sortedComments });
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Create comment
app.post('/make-server-0ea22bba/posts/:postId/comments', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const postId = c.req.param('postId');
    const { content } = await c.req.json();
    
    if (!content?.trim()) {
      return c.json({ error: 'Comment content is required' }, 400);
    }
    
    // Get user profile for author info
    const userProfile = await kv.get(`user:${userId}`);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }
    
    // Create comment
    const commentId = crypto.randomUUID();
    const comment = {
      id: commentId,
      postId,
      userId,
      authorName: userProfile.name,
      authorPhotoUrl: userProfile.photoUrl,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`comment:${postId}:${commentId}`, comment);
    
    // Update post comment count
    const post = await kv.get(`post:${postId}`);
    if (post) {
      post.comments = (post.comments || 0) + 1;
      await kv.set(`post:${postId}`, post);
    }
    
    console.log('✅ Comment created:', commentId);
    return c.json({ comment });
  } catch (error: any) {
    console.error('Error creating comment:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete comment
app.delete('/make-server-0ea22bba/posts/:postId/comments/:commentId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const postId = c.req.param('postId');
    const commentId = c.req.param('commentId');
    
    // Get comment to check ownership
    const comment = await kv.get(`comment:${postId}:${commentId}`);
    if (!comment) {
      return c.json({ error: 'Comment not found' }, 404);
    }
    
    // Check if user is the author or master
    const isMaster = await isMasterUser(userId);
    if (comment.userId !== userId && !isMaster) {
      return c.json({ error: 'You can only delete your own comments' }, 403);
    }
    
    // Delete comment
    await kv.del(`comment:${postId}:${commentId}`);
    
    // Update post comment count
    const post = await kv.get(`post:${postId}`);
    if (post) {
      post.comments = Math.max(0, (post.comments || 0) - 1);
      await kv.set(`post:${postId}`, post);
    }
    
    console.log('✅ Comment deleted:', commentId);
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= STORAGE INITIALIZATION =============

// Initialize storage bucket on startup
const BUCKET_NAME = 'make-0ea22bba-posts';

async function initializeStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      console.log(`📦 Creating bucket: ${BUCKET_NAME}`);
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 52428800, // 50MB
      });
      
      // Ignorar erro se bucket já existe (race condition ou erro 409)
      if (error && error.statusCode !== '409' && !error.message?.includes('already exists')) {
        console.error('❌ Error creating bucket:', error);
      } else {
        console.log(`✅ Bucket ${BUCKET_NAME} created successfully`);
      }
    } else {
      console.log(`✅ Bucket ${BUCKET_NAME} already exists`);
    }
  } catch (error: any) {
    // Ignorar erro se bucket já existe
    if (error?.statusCode !== '409' && !error?.message?.includes('already exists')) {
      console.error('❌ Error initializing storage:', error);
    } else {
      console.log(`✅ Bucket ${BUCKET_NAME} already exists (caught in catch)`);
    }
  }
}

// Initialize storage on server start
initializeStorage();

// ============= MEDIA UPLOAD ROUTE =============

app.post('/make-server-0ea22bba/upload', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    console.log('📤 Upload request from user:', userId);
    
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('❌ No file provided in upload request');
      return c.json({ error: 'No file provided' }, 400);
    }
    
    const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
    console.log('📤 File details:', {
      name: file.name,
      type: file.type,
      size: `${fileSizeMB} MB`
    });
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ Invalid file type:', file.type);
      return c.json({ error: 'Invalid file type. Only images and videos are allowed.' }, 400);
    }
    
    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('❌ File too large:', fileSizeMB, 'MB');
      return c.json({ error: 'File too large. Maximum size is 50MB.' }, 400);
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${timestamp}.${fileExt}`;
    
    console.log('📤 Uploading to storage:', fileName);
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);
    
    console.log('📤 File converted, starting upload...');
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileData, {
        contentType: file.type,
        upsert: false,
      });
    
    if (error) {
      console.error('❌ Storage upload error:', error);
      return c.json({ error: `Upload failed: ${error.message}` }, 500);
    }
    
    console.log('✅ File uploaded successfully:', data.path);
    
    // Generate signed URL (valid for 1 year)
    const { data: signedUrlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 31536000); // 1 year in seconds
    
    if (!signedUrlData?.signedUrl) {
      console.error('❌ Failed to generate signed URL');
      return c.json({ error: 'Failed to generate signed URL' }, 500);
    }
    
    const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
    
    console.log('✅ Upload complete, returning URL:', signedUrlData.signedUrl.substring(0, 50) + '...');
    
    return c.json({ 
      url: signedUrlData.signedUrl, 
      mediaType,
      fileName: data.path 
    });
  } catch (error: any) {
    console.error('❌ Error in upload route:', error);
    return c.json({ error: error.message || 'Upload failed' }, 500);
  }
});

// ============= AVATAR UPLOAD ROUTE =============

app.post('/make-server-0ea22bba/upload-avatar', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }
    
    console.log('📸 Avatar upload request from user:', userId);
    console.log('📸 File type:', file.type);
    console.log('📸 File size:', file.size);
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only JPG, PNG, and WEBP are allowed.' }, 400);
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return c.json({ error: 'File too large. Maximum size is 5MB.' }, 400);
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `avatars/${userId}-${timestamp}.${fileExt}`;
    
    console.log('📸 Uploading to:', fileName);
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);
    
    // Upload to Supabase Storage using service role (bypasses RLS)
    const { data, error } = await supabase.storage
      .from('make-0ea22bba-avatars')
      .upload(fileName, fileData, {
        contentType: file.type,
        upsert: true, // Allow overwriting
        cacheControl: '3600',
      });
    
    if (error) {
      console.error('❌ Storage upload error:', error);
      return c.json({ error: `Upload failed: ${error.message}` }, 500);
    }
    
    console.log('✅ File uploaded successfully:', data);
    
    // Get public URL (bucket is public)
    const { data: urlData } = supabase.storage
      .from('make-0ea22bba-avatars')
      .getPublicUrl(fileName);
    
    const publicUrl = urlData.publicUrl;
    
    console.log('🔗 Public URL generated:', publicUrl);
    
    return c.json({ 
      url: publicUrl,
      fileName: data.path 
    });
  } catch (error: any) {
    console.error('❌ Error in avatar upload route:', error);
    return c.json({ error: error.message || 'Upload failed' }, 500);
  }
});

// ============= FOLLOW ROUTES =============

app.post('/make-server-0ea22bba/follow/:targetUserId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const targetUserId = c.req.param('targetUserId');
    const followKey = `follow:${userId}:${targetUserId}`;
    
    const existingFollow = await kv.get(followKey);
    
    if (existingFollow) {
      // Unfollow
      await kv.del(followKey);
      
      const user = await kv.get(`user:${userId}`);
      const targetUser = await kv.get(`user:${targetUserId}`);
      
      if (user) {
        user.following = Math.max(0, user.following - 1);
        await kv.set(`user:${userId}`, user);
      }
      
      if (targetUser) {
        targetUser.followers = Math.max(0, targetUser.followers - 1);
        await kv.set(`user:${targetUserId}`, targetUser);
      }
      
      return c.json({ following: false });
    } else {
      // Follow
      await kv.set(followKey, { followerId: userId, followingId: targetUserId, createdAt: new Date().toISOString() });
      
      const user = await kv.get(`user:${userId}`);
      const targetUser = await kv.get(`user:${targetUserId}`);
      
      if (user) {
        user.following = (user.following || 0) + 1;
        await kv.set(`user:${userId}`, user);
      }
      
      if (targetUser) {
        targetUser.followers = (targetUser.followers || 0) + 1;
        await kv.set(`user:${targetUserId}`, targetUser);
      }
      
      return c.json({ following: true });
    }
  } catch (error: any) {
    console.log('Error following user:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get follow status for multiple users
app.get('/make-server-0ea22bba/follow/check', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    
    // Get all follows by this user
    const allFollows = await kv.getByPrefix(`follow:${userId}:`);
    const followingIds = allFollows.map((f: any) => f.followingId);
    
    return c.json({ followingIds });
  } catch (error: any) {
    console.error('❌ Error checking follows:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= TOURNAMENT ROUTES =============

app.post('/make-server-0ea22bba/tournaments', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const { name, startDate, endDate, location, maxTeams } = await c.req.json();
    
    const userProfile = await kv.get(`user:${userId}`);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }
    
    const tournamentId = crypto.randomUUID();
    const tournamentKey = `tournament:${tournamentId}`;
    const tournament = {
      id: tournamentId,
      name,
      organizerId: userId,
      organizerName: userProfile.name,
      startDate,
      endDate,
      location,
      maxTeams: maxTeams || 16,
      format: 'single_elimination', // Default format
      registeredTeams: [], // Lista de times registrados
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(tournamentKey, tournament);
    console.log(`✅ Tournament created: ${tournamentKey} - ${name}`);
    
    return c.json({ tournament });
  } catch (error: any) {
    console.log('Error creating tournament:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.get('/make-server-0ea22bba/tournaments', async (c) => {
  try {
    const status = c.req.query('status');
    
    const tournaments = await kv.getByPrefix('tournament:');
    let filteredTournaments = tournaments;
    
    if (status) {
      filteredTournaments = filteredTournaments.filter((t: any) => t.status === status);
    }
    
    const sortedTournaments = filteredTournaments.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json({ tournaments: sortedTournaments });
  } catch (error: any) {
    console.log('Error fetching tournaments:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= INVITATIONS ROUTES =============

app.post('/make-server-0ea22bba/invitations', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const { athleteId, message } = await c.req.json();
    
    const team = await kv.get(`user:${userId}`);
    if (!team || team.userType !== 'team') {
      return c.json({ error: 'Only teams can send invitations' }, 403);
    }
    
    const invitationId = crypto.randomUUID();
    const invitation = {
      id: invitationId,
      teamId: userId,
      teamName: team.name,
      athleteId,
      message: message || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`invitation:${invitationId}`, invitation);
    
    return c.json({ invitation });
  } catch (error: any) {
    console.log('Error creating invitation:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.get('/make-server-0ea22bba/invitations', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    
    const allInvitations = await kv.getByPrefix('invitation:');
    const userInvitations = allInvitations.filter((inv: any) => inv.athleteId === userId);
    
    const sortedInvitations = userInvitations.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json({ invitations: sortedInvitations });
  } catch (error: any) {
    console.log('Error fetching invitations:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.put('/make-server-0ea22bba/invitations/:invitationId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const invitationId = c.req.param('invitationId');
    const { status } = await c.req.json(); // 'accepted' or 'rejected'
    
    const invitation = await kv.get(`invitation:${invitationId}`);
    if (!invitation) {
      return c.json({ error: 'Invitation not found' }, 404);
    }
    
    if (invitation.athleteId !== userId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    invitation.status = status;
    await kv.set(`invitation:${invitationId}`, invitation);
    
    return c.json({ invitation });
  } catch (error: any) {
    console.log('Error updating invitation:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= FREE AGENT ROUTES =============

app.put('/make-server-0ea22bba/users/:userId/free-agent', authMiddleware, async (c) => {
  try {
    const userId = c.req.param('userId');
    const currentUserId = c.get('userId');
    
    if (userId !== currentUserId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    const { freeAgent } = await c.req.json();
    const profile = await kv.get(`user:${userId}`);
    
    if (!profile) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    if (profile.userType !== 'athlete') {
      return c.json({ error: 'Only athletes can be free agents' }, 400);
    }
    
    profile.freeAgent = freeAgent;
    await kv.set(`user:${userId}`, profile);
    
    console.log(`✅ User ${userId} freeAgent status updated to:`, freeAgent);
    
    return c.json({ profile });
  } catch (error: any) {
    console.error('❌ Error updating free agent status:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= TOURNAMENT ROUTES =============

// Create tournament (only teams can create)
app.post('/make-server-0ea22bba/tournaments', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const organizer = await kv.get(`user:${userId}`);
    
    if (!organizer || organizer.userType !== 'team') {
      return c.json({ error: 'Only teams can create tournaments' }, 403);
    }
    
    const { name, location, startDate, endDate, maxTeams = 16, format = 'single_elimination' } = await c.req.json();
    
    if (!name || !location || !startDate || !endDate) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const tournamentId = `tournament:${Date.now()}:${userId}`;
    const tournament = {
      id: tournamentId,
      name,
      location,
      startDate,
      endDate,
      organizerId: userId,
      organizerName: organizer.name,
      status: 'upcoming', // upcoming, ongoing, finished
      maxTeams,
      format, // single_elimination, double_elimination, round_robin
      registeredTeams: [],
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(tournamentId, tournament);
    console.log('✅ Tournament created:', tournamentId);
    
    return c.json({ tournament });
  } catch (error: any) {
    console.error('❌ Error creating tournament:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get all tournaments
app.get('/make-server-0ea22bba/tournaments', async (c) => {
  try {
    const status = c.req.query('status');
    const allTournaments = await kv.getByPrefix('tournament:');
    
    let tournaments = allTournaments;
    if (status) {
      tournaments = allTournaments.filter((t: any) => t.status === status);
    }
    
    // Sort by creation date, newest first
    tournaments.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    console.log(`📋 Returning ${tournaments.length} tournaments`);
    return c.json({ tournaments });
  } catch (error: any) {
    console.error('❌ Error getting tournaments:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get tournament details
app.get('/make-server-0ea22bba/tournaments/:tournamentId', async (c) => {
  try {
    const id = c.req.param('tournamentId');
    
    // Validar ID
    if (!id || id === 'undefined' || id === 'null' || id.trim() === '') {
      console.error('❌ ID de torneio inválido:', id);
      return c.json({ error: 'Invalid tournament ID' }, 400);
    }
    
    // Verificar se já tem o prefixo 'tournament:'
    const tournamentId = id.startsWith('tournament:') ? id : `tournament:${id}`;
    const baseId = id.replace('tournament:', ''); // ID sem prefixo para matches
    
    console.log(`📋 Buscando torneio: ${tournamentId}`);
    const tournament = await kv.get(tournamentId);
    
    if (!tournament) {
      console.error(`❌ Torneio não encontrado: ${tournamentId}`);
      // Listar torneios disponíveis para debug
      const allTournaments = await kv.getByPrefix('tournament:');
      console.log('📋 Torneios disponíveis:', allTournaments?.map((t: any) => ({ id: t.id, name: t.name })) || []);
      return c.json({ error: 'Tournament not found' }, 404);
    }

    console.log(`✅ Torneio encontrado: ${tournament.name}`);
    
    // Get matches for this tournament (usar baseId sem prefixo)
    const allMatches = await kv.getByPrefix(`match:${baseId}:`);
    
    console.log(`📋 ${allMatches?.length || 0} partidas encontradas`);
    
    // Get registered teams details
    const teamsDetails = await Promise.all(
      (tournament.registeredTeams || []).map(async (teamId: string) => {
        const team = await kv.get(`user:${teamId}`);
        return team;
      })
    );
    
    console.log(`👥 ${teamsDetails.filter(Boolean).length} times encontrados`);
    
    return c.json({ 
      tournament,
      matches: allMatches || [],
      teams: teamsDetails.filter(Boolean),
    });
  } catch (error: any) {
    console.error('❌ Error getting tournament:', error);
    return c.json({ error: error.message || 'Internal server error' }, 500);
  }
});

// Register team in tournament
app.post('/make-server-0ea22bba/tournaments/:tournamentId/register', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    
    console.log('📝 Register team request:', {
      userId,
      tournamentId,
    });
    
    const user = await kv.get(`user:${userId}`);
    if (!user || user.userType !== 'team') {
      console.log('❌ User is not a team:', { userType: user?.userType });
      return c.json({ error: 'Only teams can register for tournaments' }, 403);
    }
    
    const tournamentKey = `tournament:${tournamentId}`;
    const tournament = await kv.get(tournamentKey);
    if (!tournament) {
      console.log('❌ Tournament not found:', { tournamentId, tournamentKey });
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    console.log('🏆 Tournament found:', {
      name: tournament.name,
      status: tournament.status,
      registeredTeams: tournament.registeredTeams || [],
      maxTeams: tournament.maxTeams
    });
    
    if (tournament.status !== 'upcoming') {
      console.log('❌ Tournament not accepting registrations, status:', tournament.status);
      return c.json({ error: 'Tournament is not accepting registrations' }, 400);
    }
    
    const registeredTeams = tournament.registeredTeams || [];
    
    if (registeredTeams.includes(userId)) {
      console.log('❌ Team already registered:', {
        userId,
        registeredTeams
      });
      return c.json({ error: 'Team already registered' }, 400);
    }
    
    if (registeredTeams.length >= tournament.maxTeams) {
      console.log('❌ Tournament is full:', {
        currentTeams: registeredTeams.length,
        maxTeams: tournament.maxTeams
      });
      return c.json({ error: 'Tournament is full' }, 400);
    }
    
    registeredTeams.push(userId);
    tournament.registeredTeams = registeredTeams;
    await kv.set(tournamentKey, tournament);
    
    console.log(`✅ Team ${user.name} (${userId}) registered for tournament ${tournament.name}`);
    
    return c.json({ tournament });
  } catch (error: any) {
    console.error('❌ Error registering team:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Unregister team from tournament
app.delete('/make-server-0ea22bba/tournaments/:tournamentId/register', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    
    const tournamentKey = `tournament:${tournamentId}`;
    const tournament = await kv.get(tournamentKey);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    if (tournament.status !== 'upcoming') {
      return c.json({ error: 'Cannot unregister from ongoing tournament' }, 400);
    }
    
    const registeredTeams = tournament.registeredTeams || [];
    const index = registeredTeams.indexOf(userId);
    
    if (index === -1) {
      return c.json({ error: 'Team not registered' }, 400);
    }
    
    registeredTeams.splice(index, 1);
    tournament.registeredTeams = registeredTeams;
    await kv.set(tournamentKey, tournament);
    
    console.log(`✅ Team ${userId} unregistered from tournament ${tournamentId}`);
    
    return c.json({ tournament });
  } catch (error: any) {
    console.error('❌ Error unregistering team:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Draw/generate brackets (only organizer)
app.post('/make-server-0ea22bba/tournaments/:tournamentId/draw', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    
    const tournamentKey = `tournament:${tournamentId}`;
    const tournament = await kv.get(tournamentKey);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    if (tournament.organizerId !== userId) {
      return c.json({ error: 'Only organizer can draw brackets' }, 403);
    }
    
    if (tournament.status !== 'upcoming') {
      return c.json({ error: 'Tournament already started' }, 400);
    }
    
    const teams = tournament.registeredTeams || [];
    
    if (teams.length < 2) {
      return c.json({ error: 'Need at least 2 teams to start tournament' }, 400);
    }
    
    // Shuffle teams for random draw
    const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
    
    // Generate matches based on format
    const matches = [];
    
    if (tournament.format === 'single_elimination') {
      // Single elimination bracket
      const numMatches = Math.ceil(shuffledTeams.length / 2);
      
      for (let i = 0; i < numMatches; i++) {
        const homeTeamId = shuffledTeams[i * 2];
        const awayTeamId = shuffledTeams[i * 2 + 1] || null; // BYE if odd number
        
        const matchId = `match:${tournamentId}:round1:${i}`;
        const match = {
          id: matchId,
          tournamentId,
          round: 1,
          matchNumber: i + 1,
          homeTeamId,
          awayTeamId,
          homeScore: null,
          awayScore: null,
          status: 'pending', // pending, completed
          createdAt: new Date().toISOString(),
        };
        
        await kv.set(matchId, match);
        matches.push(match);
      }
    } else if (tournament.format === 'round_robin') {
      // Round robin - every team plays every other team
      let matchNumber = 1;
      for (let i = 0; i < shuffledTeams.length; i++) {
        for (let j = i + 1; j < shuffledTeams.length; j++) {
          const matchId = `match:${tournamentId}:rr:${matchNumber}`;
          const match = {
            id: matchId,
            tournamentId,
            round: 1,
            matchNumber,
            homeTeamId: shuffledTeams[i],
            awayTeamId: shuffledTeams[j],
            homeScore: null,
            awayScore: null,
            status: 'pending',
            createdAt: new Date().toISOString(),
          };
          
          await kv.set(matchId, match);
          matches.push(match);
          matchNumber++;
        }
      }
    }
    
    // Update tournament status
    tournament.status = 'ongoing';
    tournament.drawnAt = new Date().toISOString();
    await kv.set(tournamentKey, tournament);
    
    console.log(`✅ Tournament ${tournamentId} draw completed: ${matches.length} matches created`);
    
    return c.json({ tournament, matches });
  } catch (error: any) {
    console.error('❌ Error drawing tournament:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update match result (organizer only)
app.put('/make-server-0ea22bba/tournaments/:tournamentId/matches/:matchId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const matchId = c.req.param('matchId');
    
    const tournamentKey = `tournament:${tournamentId}`;
    const tournament = await kv.get(tournamentKey);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    if (tournament.organizerId !== userId) {
      return c.json({ error: 'Only organizer can update match results' }, 403);
    }
    
    const match = await kv.get(matchId);
    if (!match) {
      return c.json({ error: 'Match not found' }, 404);
    }
    
    const { homeScore, awayScore, homeSets, awaySets } = await c.req.json();
    
    match.homeScore = homeScore;
    match.awayScore = awayScore;
    match.homeSets = homeSets;
    match.awaySets = awaySets;
    match.status = 'completed';
    match.completedAt = new Date().toISOString();
    
    await kv.set(matchId, match);
    
    console.log(`✅ Match ${matchId} result updated`);
    
    return c.json({ match });
  } catch (error: any) {
    console.error('❌ Error updating match:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get tournament standings
app.get('/make-server-0ea22bba/tournaments/:tournamentId/standings', async (c) => {
  try {
    const tournamentId = c.req.param('tournamentId');
    
    const tournamentKey = `tournament:${tournamentId}`;
    const tournament = await kv.get(tournamentKey);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    const allMatches = await kv.getByPrefix(`match:${tournamentId}:`);
    const completedMatches = allMatches.filter((m: any) => m.status === 'completed');
    
    // Calculate standings
    const standings: any = {};
    
    for (const teamId of tournament.registeredTeams || []) {
      standings[teamId] = {
        teamId,
        played: 0,
        wins: 0,
        losses: 0,
        setsWon: 0,
        setsLost: 0,
        points: 0,
      };
    }
    
    for (const match of completedMatches) {
      const { homeTeamId, awayTeamId, homeSets, awaySets } = match;
      
      if (!homeTeamId || !awayTeamId) continue;
      
      standings[homeTeamId].played++;
      standings[awayTeamId].played++;
      
      standings[homeTeamId].setsWon += homeSets || 0;
      standings[homeTeamId].setsLost += awaySets || 0;
      standings[awayTeamId].setsWon += awaySets || 0;
      standings[awayTeamId].setsLost += homeSets || 0;
      
      if (homeSets > awaySets) {
        standings[homeTeamId].wins++;
        standings[homeTeamId].points += 3;
        standings[awayTeamId].losses++;
      } else {
        standings[awayTeamId].wins++;
        standings[awayTeamId].points += 3;
        standings[homeTeamId].losses++;
      }
    }
    
    // Convert to array and sort by points, then wins
    const standingsArray = Object.values(standings).sort((a: any, b: any) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.wins - a.wins;
    });
    
    // Get team names
    const standingsWithNames = await Promise.all(
      standingsArray.map(async (s: any) => {
        const team = await kv.get(`user:${s.teamId}`);
        return {
          ...s,
          teamName: team?.name || 'Unknown Team',
        };
      })
    );
    
    return c.json({ standings: standingsWithNames });
  } catch (error: any) {
    console.error('❌ Error getting standings:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Vote for MVP
app.post('/make-server-0ea22bba/tournaments/:tournamentId/mvp/vote', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const { athleteId, points = 1 } = await c.req.json();
    
    if (!athleteId) {
      return c.json({ error: 'Athlete ID required' }, 400);
    }
    
    const voteKey = `mvp:${tournamentId}:${userId}`;
    const existingVote = await kv.get(voteKey);
    
    if (existingVote) {
      return c.json({ error: 'You already voted in this tournament' }, 400);
    }
    
    const vote = {
      tournamentId,
      athleteId,
      voterId: userId,
      points,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(voteKey, vote);
    
    console.log(`✅ MVP vote registered: ${userId} voted for ${athleteId}`);
    
    return c.json({ vote });
  } catch (error: any) {
    console.error('❌ Error voting for MVP:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get MVP rankings
app.get('/make-server-0ea22bba/tournaments/:tournamentId/mvp', async (c) => {
  try {
    const tournamentId = c.req.param('tournamentId');
    
    const allVotes = await kv.getByPrefix(`mvp:${tournamentId}:`);
    
    // Count votes per athlete
    const voteCounts: any = {};
    
    for (const vote of allVotes) {
      const athleteId = vote.athleteId;
      if (!voteCounts[athleteId]) {
        voteCounts[athleteId] = {
          athleteId,
          totalVotes: 0,
          totalPoints: 0,
        };
      }
      voteCounts[athleteId].totalVotes++;
      voteCounts[athleteId].totalPoints += vote.points || 1;
    }
    
    // Convert to array and sort
    const rankings = Object.values(voteCounts).sort((a: any, b: any) => {
      return b.totalPoints - a.totalPoints;
    });
    
    // Get athlete details
    const rankingsWithDetails = await Promise.all(
      rankings.map(async (r: any, index: number) => {
        const athlete = await kv.get(`user:${r.athleteId}`);
        return {
          position: index + 1,
          ...r,
          athleteName: athlete?.name || 'Unknown Athlete',
          athletePosition: athlete?.position || '',
          athletePhotoUrl: athlete?.photoUrl || null,
        };
      })
    );
    
    return c.json({ rankings: rankingsWithDetails });
  } catch (error: any) {
    console.error('❌ Error getting MVP rankings:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= ADMIN ROUTES =============

// Reset tournaments - delete all and create seed tournament
app.post('/make-server-0ea22bba/admin/reset-tournaments', async (c) => {
  try {
    console.log('🔄 Resetting tournaments...');
    
    // Delete all tournaments
    const allTournaments = await kv.getByPrefix('tournament:');
    for (const tournament of allTournaments) {
      await kv.del(tournament.id);
      console.log(`🗑️ Deleted tournament: ${tournament.id}`);
    }
    
    // Delete all matches
    const allMatches = await kv.getByPrefix('match:');
    for (const match of allMatches) {
      await kv.del(match.id);
      console.log(`🗑️ Deleted match: ${match.id}`);
    }
    
    // Delete all MVP votes
    const allVotes = await kv.getByPrefix('mvp:');
    for (const vote of allVotes) {
      await kv.del(`mvp:${vote.tournamentId}:${vote.voterId}`);
      console.log(`🗑️ Deleted MVP vote`);
    }
    
    // Create seed tournament: Campeonato Municipal 2025
    const seedTournamentId = 'tournament:1700000000000:seed';
    const seedTournament = {
      id: seedTournamentId,
      name: 'Campeonato Municipal 2025',
      location: 'São Paulo, SP',
      startDate: '2025-03-01',
      endDate: '2025-05-30',
      organizerId: 'system',
      organizerName: 'Prefeitura de São Paulo',
      status: 'upcoming',
      maxTeams: 16,
      format: 'single_elimination',
      registeredTeams: [],
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(seedTournamentId, seedTournament);
    console.log('✅ Created seed tournament: Campeonato Municipal 2025');
    
    return c.json({ 
      success: true,
      message: 'Tournaments reset successfully',
      seedTournament,
    });
  } catch (error: any) {
    console.error('❌ Error resetting tournaments:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Cancel tournament (only organizer can cancel)
app.post('/make-server-0ea22bba/tournaments/:tournamentId/cancel', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const { reason } = await c.req.json();
    
    if (!reason || reason.trim() === '') {
      return c.json({ error: 'Cancellation reason is required' }, 400);
    }
    
    const tournamentKey = `tournament:${tournamentId}`;
    const tournament = await kv.get(tournamentKey);
    
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    // Only organizer can cancel
    if (tournament.organizerId !== userId) {
      return c.json({ error: 'Only the organizer can cancel the tournament' }, 403);
    }
    
    // Cannot cancel finished tournaments
    if (tournament.status === 'finished') {
      return c.json({ error: 'Cannot cancel finished tournaments' }, 400);
    }
    
    // Already cancelled
    if (tournament.status === 'cancelled') {
      return c.json({ error: 'Tournament is already cancelled' }, 400);
    }
    
    // Update tournament status
    tournament.status = 'cancelled';
    tournament.cancelledAt = new Date().toISOString();
    tournament.cancellationReason = reason.trim();
    tournament.cancelledBy = userId;
    
    await kv.set(tournamentKey, tournament);
    
    console.log(`🚫 Tournament cancelled: ${tournamentId} - Reason: ${reason}`);
    
    return c.json({ 
      success: true,
      tournament,
      message: 'Tournament cancelled successfully'
    });
  } catch (error: any) {
    console.error('❌ Error cancelling tournament:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= TEAM INVITATION ROUTES =============

// Send invitation to athlete (only teams can send)
app.post('/make-server-0ea22bba/invitations/send', authMiddleware, async (c) => {
  try {
    const teamId = c.get('userId');
    const team = await kv.get(`user:${teamId}`);
    
    if (!team || team.userType !== 'team') {
      return c.json({ error: 'Only teams can send invitations' }, 403);
    }
    
    const { athleteId, message } = await c.req.json();
    
    if (!athleteId) {
      return c.json({ error: 'Athlete ID is required' }, 400);
    }
    
    // Get athlete data
    const athlete = await kv.get(`user:${athleteId}`);
    
    if (!athlete) {
      return c.json({ error: 'Athlete not found' }, 404);
    }
    
    if (athlete.userType !== 'athlete') {
      return c.json({ error: 'Can only invite athletes' }, 400);
    }
    
    // VALIDAÇÃO: Atleta deve ter CPF cadastrado
    if (!athlete.cpf || athlete.cpf.trim() === '') {
      return c.json({ 
        error: 'Athlete must have CPF registered',
        details: 'O atleta precisa cadastrar o CPF no perfil antes de receber convites'
      }, 400);
    }
    
    // VALIDAÇÃO: Verificar se o CPF já está em outro time
    if (athlete.currentTeam && athlete.currentTeam !== teamId) {
      return c.json({ 
        error: 'Athlete already has a team',
        details: `Este atleta já faz parte do time: ${athlete.currentTeam}`
      }, 400);
    }
    
    // VALIDAÇÃO: Verificar se CPF não está em uso por outro atleta em outro time
    const allAthletes = await kv.getByPrefix('user:');
    const athletesWithSameCPF = allAthletes.filter((a: any) => 
      a.userType === 'athlete' && 
      a.cpf === athlete.cpf && 
      a.id !== athleteId &&
      a.currentTeam && 
      a.currentTeam !== ''
    );
    
    if (athletesWithSameCPF.length > 0) {
      return c.json({ 
        error: 'CPF already in use by another athlete in a team',
        details: 'Este CPF já está vinculado a outro atleta que faz parte de um time'
      }, 400);
    }
    
    // Create invitation
    const invitationId = `invitation:${Date.now()}:${teamId}:${athleteId}`;
    const invitation = {
      id: invitationId,
      teamId,
      teamName: team.name,
      athleteId,
      athleteName: athlete.name,
      athleteCPF: athlete.cpf,
      message: message || null,
      status: 'pending', // pending, accepted, rejected
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(invitationId, invitation);
    console.log('✅ Invitation sent:', invitationId);
    
    return c.json({ invitation });
  } catch (error: any) {
    console.error('❌ Error sending invitation:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get invitations for athlete
app.get('/make-server-0ea22bba/invitations/athlete', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const allInvitations = await kv.getByPrefix('invitation:');
    
    const athleteInvitations = allInvitations.filter((inv: any) => 
      inv.athleteId === userId && inv.status === 'pending'
    );
    
    return c.json({ invitations: athleteInvitations });
  } catch (error: any) {
    console.error('❌ Error getting athlete invitations:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get invitations sent by team
app.get('/make-server-0ea22bba/invitations/team', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const allInvitations = await kv.getByPrefix('invitation:');
    
    const teamInvitations = allInvitations.filter((inv: any) => 
      inv.teamId === userId
    );
    
    return c.json({ invitations: teamInvitations });
  } catch (error: any) {
    console.error('❌ Error getting team invitations:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Accept invitation
app.post('/make-server-0ea22bba/invitations/:invitationId/accept', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const invitationId = c.req.param('invitationId');
    
    const invitation = await kv.get(invitationId);
    
    if (!invitation) {
      return c.json({ error: 'Invitation not found' }, 404);
    }
    
    if (invitation.athleteId !== userId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    if (invitation.status !== 'pending') {
      return c.json({ error: 'Invitation already processed' }, 400);
    }
    
    // Get athlete
    const athlete = await kv.get(`user:${userId}`);
    
    if (!athlete) {
      return c.json({ error: 'Athlete not found' }, 404);
    }
    
    // VALIDAÇÃO: Verificar se CPF não está em outro time (double-check)
    if (athlete.currentTeam && athlete.currentTeam !== invitation.teamId) {
      return c.json({ 
        error: 'You already have a team',
        details: 'Você já faz parte de outro time'
      }, 400);
    }
    
    // Update invitation status
    invitation.status = 'accepted';
    invitation.acceptedAt = new Date().toISOString();
    await kv.set(invitationId, invitation);
    
    // Update athlete's currentTeam
    const oldTeam = athlete.currentTeam;
    athlete.currentTeam = invitation.teamName;
    athlete.currentTeamId = invitation.teamId;
    
    // Move old team to history if exists
    if (oldTeam && oldTeam !== invitation.teamName) {
      const history = athlete.teamHistory || '';
      const today = new Date().toISOString().split('T')[0];
      const newHistory = history 
        ? `${history}, ${oldTeam} (até ${today})`
        : `${oldTeam} (até ${today})`;
      athlete.teamHistory = newHistory;
    }
    
    await kv.set(`user:${userId}`, athlete);
    
    console.log(`✅ Invitation accepted: ${userId} joined ${invitation.teamName}`);
    
    return c.json({ 
      success: true,
      athlete,
      message: `Você agora faz parte do ${invitation.teamName}!`
    });
  } catch (error: any) {
    console.error('❌ Error accepting invitation:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Reject invitation
app.post('/make-server-0ea22bba/invitations/:invitationId/reject', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const invitationId = c.req.param('invitationId');
    
    const invitation = await kv.get(invitationId);
    
    if (!invitation) {
      return c.json({ error: 'Invitation not found' }, 404);
    }
    
    if (invitation.athleteId !== userId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    if (invitation.status !== 'pending') {
      return c.json({ error: 'Invitation already processed' }, 400);
    }
    
    // Update invitation status
    invitation.status = 'rejected';
    invitation.rejectedAt = new Date().toISOString();
    await kv.set(invitationId, invitation);
    
    console.log(`✅ Invitation rejected: ${userId} rejected ${invitation.teamName}`);
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error rejecting invitation:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Leave team (athlete leaves current team)
app.post('/make-server-0ea22bba/teams/leave', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const athlete = await kv.get(`user:${userId}`);
    
    if (!athlete || athlete.userType !== 'athlete') {
      return c.json({ error: 'Only athletes can leave teams' }, 403);
    }
    
    if (!athlete.currentTeam) {
      return c.json({ error: 'You are not in a team' }, 400);
    }
    
    // Move current team to history
    const oldTeam = athlete.currentTeam;
    const history = athlete.teamHistory || '';
    const today = new Date().toISOString().split('T')[0];
    const newHistory = history 
      ? `${history}, ${oldTeam} (até ${today})`
      : `${oldTeam} (até ${today})`;
    
    athlete.teamHistory = newHistory;
    athlete.currentTeam = null;
    athlete.currentTeamId = null;
    
    await kv.set(`user:${userId}`, athlete);
    
    console.log(`✅ Athlete left team: ${userId} left ${oldTeam}`);
    
    return c.json({ 
      success: true,
      message: `Você saiu do ${oldTeam}`
    });
  } catch (error: any) {
    console.error('❌ Error leaving team:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= MASTER ADMIN ROUTES =============

// Check if current user is master
app.get('/make-server-0ea22bba/admin/check-master', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const isMaster = await isMasterUser(userId);
    
    return c.json({ isMaster });
  } catch (error: any) {
    console.error('❌ Error checking master status:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete post (master only)
app.delete('/make-server-0ea22bba/admin/posts/:postId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const postIdParam = c.req.param('postId');
    
    // Check if user is master
    const isMaster = await isMasterUser(userId);
    if (!isMaster) {
      return c.json({ error: 'Master access required' }, 403);
    }
    
    // Ensure post ID has proper prefix
    const postId = postIdParam.startsWith('post:') ? postIdParam : `post:${postIdParam}`;
    const basePostId = postIdParam.replace('post:', '');
    
    console.log(`🗑️ [MASTER] Attempting to delete post: ${postId}`);
    
    const post = await kv.get(postId);
    if (!post) {
      console.error(`❌ Post not found: ${postId}`);
      return c.json({ error: 'Post not found' }, 404);
    }
    
    console.log(`✅ Post found: ${post.content?.substring(0, 50)}...`);
    
    // Delete post
    await kv.del(postId);
    
    // Delete associated likes (they use the base ID without prefix)
    const allLikes = await kv.getByPrefix(`like:${basePostId}:`);
    for (const like of allLikes) {
      const likeKey = `like:${basePostId}:${like.userId}`;
      await kv.del(likeKey);
    }
    
    console.log(`🗑️ [MASTER] Post and ${allLikes.length} likes deleted: ${postId}`);
    
    return c.json({ 
      success: true,
      message: 'Post and associated data deleted successfully'
    });
  } catch (error: any) {
    console.error('❌ Error deleting post (master):', error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete tournament (master only)
app.delete('/make-server-0ea22bba/admin/tournaments/:tournamentId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentIdParam = c.req.param('tournamentId');
    
    // Check if user is master
    const isMaster = await isMasterUser(userId);
    if (!isMaster) {
      return c.json({ error: 'Master access required' }, 403);
    }
    
    // Ensure tournament ID has proper prefix
    const tournamentId = tournamentIdParam.startsWith('tournament:') 
      ? tournamentIdParam 
      : `tournament:${tournamentIdParam}`;
    
    const tournament = await kv.get(tournamentId);
    if (!tournament) {
      console.error(`❌ Tournament not found: ${tournamentId}`);
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    console.log(`🗑️ [MASTER] Deleting tournament: ${tournamentId} (${tournament.name})`);
    
    // Delete tournament
    await kv.del(tournamentId);
    
    // Delete associated matches (use the base ID without prefix for match lookup)
    const baseId = tournamentIdParam.replace('tournament:', '');
    const allMatches = await kv.getByPrefix(`match:${baseId}:`);
    for (const match of allMatches) {
      await kv.del(match.id);
    }
    
    // Delete associated MVP votes (check both with and without prefix)
    const allVotes = await kv.getByPrefix('mvp:');
    const tournamentVotes = allVotes.filter((vote: any) => 
      vote.tournamentId === tournamentId || 
      vote.tournamentId === baseId ||
      vote.tournamentId === `tournament:${baseId}`
    );
    for (const vote of tournamentVotes) {
      await kv.del(vote.id);
    }
    
    console.log(`🗑️ [MASTER] Tournament deleted: ${tournamentId} (${allMatches.length} matches, ${tournamentVotes.length} votes)`);
    
    return c.json({ 
      success: true,
      message: 'Tournament and associated data deleted successfully'
    });
  } catch (error: any) {
    console.error('❌ Error deleting tournament (master):', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= TOURNAMENT ROSTER / CONVOCAÇÃO ROUTES =============

// Get roster for tournament/team
app.get('/make-server-0ea22bba/tournaments/:tournamentId/roster/:teamId', authMiddleware, async (c) => {
  try {
    const tournamentId = c.req.param('tournamentId');
    const teamId = c.req.param('teamId');
    
    const rosterKey = `roster:${tournamentId}:${teamId}`;
    const roster = await kv.get(rosterKey);
    
    return c.json({ roster: roster || {} });
  } catch (error: any) {
    console.error('❌ Error getting roster:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Save/Update roster
app.post('/make-server-0ea22bba/tournaments/:tournamentId/roster', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const { teamId, roster } = await c.req.json();
    
    // Verificar se o usuário é o time
    if (userId !== teamId) {
      return c.json({ error: 'Unauthorized - only team owner can manage roster' }, 403);
    }
    
    // Verificar se o time está inscrito no torneio
    const tournamentKey = tournamentId.startsWith('tournament:') ? tournamentId : `tournament:${tournamentId}`;
    const tournament = await kv.get(tournamentKey);
    
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    if (!tournament.registeredTeams?.includes(teamId)) {
      return c.json({ error: 'Team not registered in tournament' }, 400);
    }
    
    // Salvar roster
    const rosterKey = `roster:${tournamentId}:${teamId}`;
    const rosterData = {
      tournamentId,
      teamId,
      roster,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(rosterKey, rosterData);
    
    // Criar notificações de convocação para cada jogador
    const allPlayers = Object.values(roster).flat() as any[];
    for (const player of allPlayers) {
      const callupKey = `callup:${tournamentId}:${teamId}:${player.id}`;
      const callupData = {
        id: callupKey,
        tournamentId,
        teamId,
        playerId: player.id,
        playerName: player.name,
        position: player.position,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      await kv.set(callupKey, callupData);
      
      // Criar notificação para o jogador
      const notificationKey = `notification:${player.id}:${crypto.randomUUID()}`;
      const notification = {
        id: notificationKey,
        userId: player.id,
        type: 'tournament_callup',
        title: 'Você foi convocado!',
        message: `Você foi convocado para o torneio "${tournament.name}" pelo time. Confirme sua participação.`,
        data: {
          tournamentId,
          teamId,
          callupKey,
        },
        read: false,
        createdAt: new Date().toISOString(),
      };
      
      await kv.set(notificationKey, notification);
    }
    
    console.log(`✅ Roster saved for tournament ${tournamentId}, team ${teamId} with ${allPlayers.length} players`);
    
    return c.json({ 
      success: true,
      message: 'Roster saved successfully',
      playersNotified: allPlayers.length
    });
  } catch (error: any) {
    console.error('❌ Error saving roster:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Search player by CPF in team
app.get('/make-server-0ea22bba/teams/:teamId/search-player', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const teamId = c.req.param('teamId');
    const cpf = c.req.query('cpf');
    
    if (!cpf) {
      return c.json({ error: 'CPF is required' }, 400);
    }
    
    // Verificar se o usuário é o time
    if (userId !== teamId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // Buscar todos os atletas
    const allUsers = await kv.getByPrefix('user:');
    const athletes = allUsers.filter((user: any) => user.userType === 'athlete');
    
    // Procurar atleta por CPF e que esteja no time
    const player = athletes.find((athlete: any) => 
      athlete.cpf === cpf && athlete.currentTeamId === teamId
    );
    
    if (!player) {
      return c.json({ 
        player: null,
        error: 'Player not found or not in your team' 
      }, 404);
    }
    
    return c.json({ 
      player: {
        id: player.id,
        name: player.name,
        cpf: player.cpf,
        photoUrl: player.photoUrl,
        position: player.position,
      }
    });
  } catch (error: any) {
    console.error('❌ Error searching player:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Confirm callup (athlete side)
app.post('/make-server-0ea22bba/tournaments/:tournamentId/roster/:teamId/confirm', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const teamId = c.req.param('teamId');
    
    // Buscar convocação do jogador
    const callupKey = `callup:${tournamentId}:${teamId}:${userId}`;
    const callup = await kv.get(callupKey);
    
    if (!callup) {
      return c.json({ error: 'Callup not found' }, 404);
    }
    
    // Atualizar status
    callup.status = 'confirmed';
    callup.confirmedAt = new Date().toISOString();
    await kv.set(callupKey, callup);
    
    // Atualizar roster
    const rosterKey = `roster:${tournamentId}:${teamId}`;
    const rosterData = await kv.get(rosterKey);
    
    if (rosterData && rosterData.roster) {
      // Atualizar status do jogador no roster
      for (const position in rosterData.roster) {
        rosterData.roster[position] = rosterData.roster[position].map((player: any) => 
          player.id === userId ? { ...player, status: 'confirmed' } : player
        );
      }
      
      await kv.set(rosterKey, rosterData);
    }
    
    console.log(`✅ Player ${userId} confirmed callup for tournament ${tournamentId}, team ${teamId}`);
    
    return c.json({ 
      success: true,
      message: 'Callup confirmed successfully'
    });
  } catch (error: any) {
    console.error('❌ Error confirming callup:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Decline callup (athlete side)
app.post('/make-server-0ea22bba/tournaments/:tournamentId/roster/:teamId/decline', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const teamId = c.req.param('teamId');
    
    // Buscar convocação do jogador
    const callupKey = `callup:${tournamentId}:${teamId}:${userId}`;
    const callup = await kv.get(callupKey);
    
    if (!callup) {
      return c.json({ error: 'Callup not found' }, 404);
    }
    
    // Atualizar status
    callup.status = 'declined';
    callup.declinedAt = new Date().toISOString();
    await kv.set(callupKey, callup);
    
    // Atualizar roster
    const rosterKey = `roster:${tournamentId}:${teamId}`;
    const rosterData = await kv.get(rosterKey);
    
    if (rosterData && rosterData.roster) {
      // Atualizar status do jogador no roster
      for (const position in rosterData.roster) {
        rosterData.roster[position] = rosterData.roster[position].map((player: any) => 
          player.id === userId ? { ...player, status: 'declined' } : player
        );
      }
      
      await kv.set(rosterKey, rosterData);
    }
    
    console.log(`✅ Player ${userId} declined callup for tournament ${tournamentId}, team ${teamId}`);
    
    return c.json({ 
      success: true,
      message: 'Callup declined'
    });
  } catch (error: any) {
    console.error('❌ Error declining callup:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get all users (master only)
app.get('/make-server-0ea22bba/admin/users', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    
    // Check if user is master
    const isMaster = await isMasterUser(userId);
    if (!isMaster) {
      return c.json({ error: 'Master access required' }, 403);
    }
    
    const allUsers = await kv.getByPrefix('user:');
    
    return c.json({ 
      users: allUsers,
      total: allUsers.length
    });
  } catch (error: any) {
    console.error('❌ Error getting users (master):', error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete user (master only)
app.delete('/make-server-0ea22bba/admin/users/:userId', authMiddleware, async (c) => {
  try {
    const masterUserId = c.get('userId');
    const targetUserId = c.req.param('userId');
    
    // Check if user is master
    const isMaster = await isMasterUser(masterUserId);
    if (!isMaster) {
      return c.json({ error: 'Master access required' }, 403);
    }
    
    // Cannot delete master account
    const targetIsMaster = await isMasterUser(targetUserId);
    if (targetIsMaster) {
      return c.json({ error: 'Cannot delete master account' }, 403);
    }
    
    const user = await kv.get(`user:${targetUserId}`);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Delete user
    await kv.del(`user:${targetUserId}`);
    
    // Delete user's posts
    const allPosts = await kv.getByPrefix('post:');
    const userPosts = allPosts.filter((post: any) => post.authorId === targetUserId);
    for (const post of userPosts) {
      await kv.del(post.id);
    }
    
    console.log(`🗑️ [MASTER] User deleted by master: ${targetUserId}`);
    
    return c.json({ 
      success: true,
      message: 'User and associated data deleted successfully'
    });
  } catch (error: any) {
    console.error('❌ Error deleting user (master):', error);
    return c.json({ error: error.message }, 500);
  }
});

// Health check
app.get('/make-server-0ea22bba/health', (c) => {
  return c.json({ status: 'ok' });
});

// ============= LIVES/STREAMING ROUTES =============

// Create a new live stream
app.post('/make-server-0ea22bba/lives', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const { title, description, scheduledFor, thumbnailUrl } = await c.req.json();
    
    if (!title) {
      return c.json({ error: 'Title is required' }, 400);
    }
    
    const liveId = `live:${crypto.randomUUID()}`;
    const live = {
      id: liveId,
      title,
      description: description || null,
      creatorId: userId,
      status: scheduledFor ? 'scheduled' : 'live', // 'scheduled', 'live', 'ended'
      scheduledFor: scheduledFor || null,
      startedAt: scheduledFor ? null : new Date().toISOString(),
      endedAt: null,
      thumbnailUrl: thumbnailUrl || null,
      viewers: 0,
      peakViewers: 0,
      chatEnabled: true,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(liveId, live);
    
    // Se começar agora, já marcar como live
    if (!scheduledFor) {
      console.log(`📺 Live criada e iniciada: ${title} por ${userId}`);
    } else {
      console.log(`📅 Live agendada: ${title} para ${scheduledFor}`);
    }
    
    return c.json({ live });
  } catch (error: any) {
    console.error('❌ Error creating live:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get all lives
app.get('/make-server-0ea22bba/lives', async (c) => {
  try {
    const status = c.req.query('status'); // 'live', 'scheduled', 'ended'
    
    const allLives = await kv.getByPrefix('live:');
    
    // Filter by status if provided
    let filteredLives = allLives;
    if (status) {
      filteredLives = allLives.filter((live: any) => live.status === status);
    }
    
    // Sort: live first, then scheduled, then ended
    const sortedLives = filteredLives.sort((a: any, b: any) => {
      const statusOrder: any = { live: 0, scheduled: 1, ended: 2 };
      if (a.status !== b.status) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      // Within same status, sort by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    // Populate creator info
    const livesWithCreators = await Promise.all(
      sortedLives.map(async (live: any) => {
        const creator = await kv.get(`user:${live.creatorId}`);
        return {
          ...live,
          creator: creator ? {
            id: creator.id,
            name: creator.name,
            nickname: creator.nickname,
            photoUrl: creator.photoUrl,
            userType: creator.userType,
            verified: creator.verified,
          } : null,
        };
      })
    );
    
    return c.json({ lives: livesWithCreators });
  } catch (error: any) {
    console.error('❌ Error getting lives:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get single live
app.get('/make-server-0ea22bba/lives/:liveId', async (c) => {
  try {
    const liveId = c.req.param('liveId');
    const fullLiveId = liveId.startsWith('live:') ? liveId : `live:${liveId}`;
    
    const live = await kv.get(fullLiveId);
    if (!live) {
      return c.json({ error: 'Live not found' }, 404);
    }
    
    // Get creator info
    const creator = await kv.get(`user:${live.creatorId}`);
    
    return c.json({
      live: {
        ...live,
        creator: creator ? {
          id: creator.id,
          name: creator.name,
          nickname: creator.nickname,
          photoUrl: creator.photoUrl,
          userType: creator.userType,
          verified: creator.verified,
        } : null,
      },
    });
  } catch (error: any) {
    console.error('❌ Error getting live:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Start a live stream
app.post('/make-server-0ea22bba/lives/:liveId/start', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const liveId = c.req.param('liveId');
    const fullLiveId = liveId.startsWith('live:') ? liveId : `live:${liveId}`;
    
    const live = await kv.get(fullLiveId);
    if (!live) {
      return c.json({ error: 'Live not found' }, 404);
    }
    
    // Check if user is the creator
    if (live.creatorId !== userId) {
      return c.json({ error: 'Only the creator can start this live' }, 403);
    }
    
    if (live.status === 'live') {
      return c.json({ error: 'Live is already started' }, 400);
    }
    
    if (live.status === 'ended') {
      return c.json({ error: 'Cannot restart an ended live' }, 400);
    }
    
    // Update status to live
    live.status = 'live';
    live.startedAt = new Date().toISOString();
    await kv.set(fullLiveId, live);
    
    console.log(`▶️ Live iniciada: ${live.title}`);
    
    return c.json({ live });
  } catch (error: any) {
    console.error('❌ Error starting live:', error);
    return c.json({ error: error.message }, 500);
  }
});

// End a live stream
app.post('/make-server-0ea22bba/lives/:liveId/end', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const liveId = c.req.param('liveId');
    const fullLiveId = liveId.startsWith('live:') ? liveId : `live:${liveId}`;
    
    const live = await kv.get(fullLiveId);
    if (!live) {
      return c.json({ error: 'Live not found' }, 404);
    }
    
    // Check if user is the creator or master
    const isMaster = await isMasterUser(userId);
    if (live.creatorId !== userId && !isMaster) {
      return c.json({ error: 'Only the creator or master can end this live' }, 403);
    }
    
    if (live.status === 'ended') {
      return c.json({ error: 'Live is already ended' }, 400);
    }
    
    // Update status to ended
    live.status = 'ended';
    live.endedAt = new Date().toISOString();
    await kv.set(fullLiveId, live);
    
    console.log(`⏹️ Live finalizada: ${live.title}`);
    
    return c.json({ live });
  } catch (error: any) {
    console.error('❌ Error ending live:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Send chat message
app.post('/make-server-0ea22bba/lives/:liveId/chat', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const liveId = c.req.param('liveId');
    const fullLiveId = liveId.startsWith('live:') ? liveId : `live:${liveId}`;
    const { message } = await c.req.json();
    
    if (!message || message.trim().length === 0) {
      return c.json({ error: 'Message cannot be empty' }, 400);
    }
    
    const live = await kv.get(fullLiveId);
    if (!live) {
      return c.json({ error: 'Live not found' }, 404);
    }
    
    if (!live.chatEnabled) {
      return c.json({ error: 'Chat is disabled for this live' }, 403);
    }
    
    // Get user info
    const user = await kv.get(`user:${userId}`);
    
    const chatMessage = {
      id: crypto.randomUUID(),
      liveId: fullLiveId,
      userId,
      userName: user?.nickname || user?.name || 'Usuário',
      userPhotoUrl: user?.photoUrl || null,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };
    
    const chatKey = `${fullLiveId}:chat:${chatMessage.id}`;
    await kv.set(chatKey, chatMessage);
    
    return c.json({ chatMessage });
  } catch (error: any) {
    console.error('❌ Error sending chat message:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get chat messages
app.get('/make-server-0ea22bba/lives/:liveId/chat', async (c) => {
  try {
    const liveId = c.req.param('liveId');
    const fullLiveId = liveId.startsWith('live:') ? liveId : `live:${liveId}`;
    const limit = parseInt(c.req.query('limit') || '50');
    
    const allMessages = await kv.getByPrefix(`${fullLiveId}:chat:`);
    
    // Sort by timestamp (newest first)
    const sortedMessages = allMessages.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    // Limit results
    const limitedMessages = sortedMessages.slice(0, limit);
    
    return c.json({ messages: limitedMessages.reverse() }); // Reverse to show oldest first
  } catch (error: any) {
    console.error('❌ Error getting chat messages:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update viewer count
app.post('/make-server-0ea22bba/lives/:liveId/viewers', authMiddleware, async (c) => {
  try {
    const liveId = c.req.param('liveId');
    const fullLiveId = liveId.startsWith('live:') ? liveId : `live:${liveId}`;
    const { action } = await c.req.json();
    
    const live = await kv.get(fullLiveId);
    if (!live) {
      return c.json({ error: 'Live not found' }, 404);
    }
    
    if (action === 'join') {
      live.viewers = (live.viewers || 0) + 1;
      live.peakViewers = Math.max(live.peakViewers || 0, live.viewers);
    } else if (action === 'leave') {
      live.viewers = Math.max((live.viewers || 0) - 1, 0);
    }
    
    await kv.set(fullLiveId, live);
    
    return c.json({ viewers: live.viewers });
  } catch (error: any) {
    console.error('❌ Error updating viewer count:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete live
app.delete('/make-server-0ea22bba/lives/:liveId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const liveId = c.req.param('liveId');
    const fullLiveId = liveId.startsWith('live:') ? liveId : `live:${liveId}`;
    
    const live = await kv.get(fullLiveId);
    if (!live) {
      return c.json({ error: 'Live not found' }, 404);
    }
    
    // Check if user is the creator or master
    const isMaster = await isMasterUser(userId);
    if (live.creatorId !== userId && !isMaster) {
      return c.json({ error: 'Only the creator or master can delete this live' }, 403);
    }
    
    // Delete live
    await kv.del(fullLiveId);
    
    // Delete all chat messages
    const chatMessages = await kv.getByPrefix(`${fullLiveId}:chat:`);
    for (const msg of chatMessages) {
      await kv.del(`${fullLiveId}:chat:${msg.id}`);
    }
    
    console.log(`🗑️ Live deletada: ${live.title}`);
    
    return c.json({ success: true, message: 'Live deleted successfully' });
  } catch (error: any) {
    console.error('❌ Error deleting live:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= ADS / ANÚNCIOS ROUTES =============

// Create ad
app.post('/make-server-0ea22bba/ads/create', async (c) => {
  try {
    const ad = await c.req.json();
    
    if (!ad.id || !ad.title || !ad.imageUrl) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Save ad with pending status
    await kv.set(ad.id, ad);
    
    console.log(`✅ Ad created (pending approval): ${ad.id} - ${ad.title}`);
    
    return c.json({ success: true, ad });
  } catch (error: any) {
    console.error('❌ Error creating ad:', error);
    return c.json({ error: error.message }, 500);
  }
});

// List all ads (for admin)
app.get('/make-server-0ea22bba/ads/list', async (c) => {
  try {
    const allAds = await kv.getByPrefix('ad_');
    
    // Sort by creation date, newest first
    allAds.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    console.log(`📋 Returning ${allAds.length} ads`);
    return c.json({ ads: allAds });
  } catch (error: any) {
    console.error('❌ Error listing ads:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get approved ads (public)
app.get('/make-server-0ea22bba/ads/approved', async (c) => {
  try {
    const allAds = await kv.getByPrefix('ad_');
    const approvedAds = allAds.filter((ad: any) => ad.status === 'approved');
    
    // Sort by approval date, newest first
    approvedAds.sort((a: any, b: any) => {
      const dateA = a.approvedAt ? new Date(a.approvedAt).getTime() : 0;
      const dateB = b.approvedAt ? new Date(b.approvedAt).getTime() : 0;
      return dateB - dateA;
    });
    
    console.log(`📋 Returning ${approvedAds.length} approved ads`);
    return c.json({ ads: approvedAds });
  } catch (error: any) {
    console.error('❌ Error getting approved ads:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Approve ad (master only)
app.post('/make-server-0ea22bba/ads/approve', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const { adId } = await c.req.json();
    
    // Check if user is master
    const isMaster = await isMasterUser(userId);
    if (!isMaster) {
      return c.json({ error: 'Master access required' }, 403);
    }
    
    const ad = await kv.get(adId);
    if (!ad) {
      return c.json({ error: 'Ad not found' }, 404);
    }
    
    // Update ad status
    ad.status = 'approved';
    ad.approvedBy = userId;
    ad.approvedAt = new Date().toISOString();
    
    await kv.set(adId, ad);
    
    console.log(`✅ [MASTER] Ad approved: ${adId} - ${ad.title}`);
    
    return c.json({ success: true, ad });
  } catch (error: any) {
    console.error('❌ Error approving ad:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Reject ad (master only)
app.post('/make-server-0ea22bba/ads/reject', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const { adId, reason } = await c.req.json();
    
    // Check if user is master
    const isMaster = await isMasterUser(userId);
    if (!isMaster) {
      return c.json({ error: 'Master access required' }, 403);
    }
    
    const ad = await kv.get(adId);
    if (!ad) {
      return c.json({ error: 'Ad not found' }, 404);
    }
    
    // Update ad status
    ad.status = 'rejected';
    ad.rejectedBy = userId;
    ad.rejectedAt = new Date().toISOString();
    ad.rejectionReason = reason || 'Not approved';
    
    await kv.set(adId, ad);
    
    console.log(`❌ [MASTER] Ad rejected: ${adId} - ${ad.title}`);
    
    return c.json({ success: true, ad });
  } catch (error: any) {
    console.error('❌ Error rejecting ad:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete ad (master only)
app.delete('/make-server-0ea22bba/ads/delete', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const { adId } = await c.req.json();
    
    // Check if user is master
    const isMaster = await isMasterUser(userId);
    if (!isMaster) {
      return c.json({ error: 'Master access required' }, 403);
    }
    
    const ad = await kv.get(adId);
    if (!ad) {
      return c.json({ error: 'Ad not found' }, 404);
    }
    
    await kv.del(adId);
    
    console.log(`🗑️ [MASTER] Ad deleted: ${adId} - ${ad.title}`);
    
    return c.json({ success: true, message: 'Ad deleted successfully' });
  } catch (error: any) {
    console.error('❌ Error deleting ad:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= LIVEKIT ROUTES =============
app.route('/', livekitRoutes);

Deno.serve(app.fetch);
