import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { addTournamentEditorRoutes } from './tournament-editor-routes.tsx';

// Multiple layers of Figma Make detection
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Check 1: Invalid URL format
const hasValidUrl = supabaseUrl.includes('supabase.co') && supabaseUrl.startsWith('http');

// Check 2: Invalid key length (real keys are 200+ chars)
const hasValidKey = supabaseKey.length > 50;

// Check 3: Check for common Figma Make indicators
const isFigmaMakeByEnv = supabaseUrl.includes('localhost') || 
                         supabaseUrl.includes('127.0.0.1') ||
                         supabaseUrl === '' ||
                         supabaseKey === '';

// FINAL DECISION: Use mocks if ANY check fails
const isFigmaMake = !hasValidUrl || !hasValidKey || isFigmaMakeByEnv;

// Log environment detection
console.log('🔍 Environment Detection:');
console.log(`   SUPABASE_URL: ${supabaseUrl ? supabaseUrl.substring(0, 40) + '...' : '(empty)'}`);
console.log(`   Valid URL format: ${hasValidUrl}`);
console.log(`   SERVICE_ROLE_KEY length: ${supabaseKey.length}`);
console.log(`   Valid key length: ${hasValidKey}`);
console.log(`   Figma Make indicators: ${isFigmaMakeByEnv}`);
console.log(`   ⚡ FINAL DECISION - Is Figma Make: ${isFigmaMake}`);

// Create mock implementations for Figma Make
const createMockSupabase = () => ({
  auth: {
    admin: {
      getUserById: async () => ({ data: { user: null }, error: null }),
      createUser: async () => ({ data: { user: null }, error: null }),
    },
    getUser: async () => ({ data: { user: null }, error: null }),
  },
  storage: {
    listBuckets: async () => ({ data: [], error: null }),
    createBucket: async () => ({ data: null, error: null }),
    from: () => ({
      upload: async () => ({ data: null, error: null }),
      createSignedUrl: async () => ({ data: { signedUrl: '' }, error: null }),
      remove: async () => ({ data: null, error: null }),
    }),
  },
});

const createMockKV = () => ({
  get: async () => null,
  set: async () => {},
  del: async () => {},
  mget: async () => [],
  mset: async () => {},
  mdel: async () => {},
  getByPrefix: async () => [],
});

const createMockLiveKit = () => ((app: any) => {
  app.post('/make-server-0ea22bba/livekit/token', async (c: any) => {
    return c.json({ error: 'LiveKit not available in Figma Make' }, 503);
  });
});

// Initialize with mocks
let supabase: any = createMockSupabase();
let kv: any = createMockKV();
let livekitRoutes: any = createMockLiveKit();

// Only try to load real modules if NOT in Figma Make
if (!isFigmaMake) {
  (async () => {
    try {
      console.log('🔄 Loading Supabase (production mode)...');
      const { createClient } = await import('npm:@supabase/supabase-js');
      supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );
      console.log('✅ Supabase initialized');
    } catch (error: any) {
      console.error('❌ Failed to initialize Supabase:', error.message);
      supabase = createMockSupabase();
    }
    
    try {
      console.log('🔄 Loading KV store...');
      const kvModule = await import('./kv_store.tsx');
      kv = kvModule;
      console.log('✅ KV store initialized');
    } catch (error: any) {
      console.error('❌ Failed to initialize KV:', error.message);
      kv = createMockKV();
    }
    
    try {
      console.log('🔄 Loading LiveKit...');
      const module = await import('./livekit.tsx');
      livekitRoutes = module.default;
      console.log('✅ LiveKit initialized');
    } catch (error: any) {
      console.error('❌ Failed to initialize LiveKit:', error.message);
      livekitRoutes = createMockLiveKit();
    }
  })();
} else {
  console.log('⚠️ Running in Figma Make mode - using mocks for all services');
  console.log('   (This is expected behavior for testing in Figma Make)');
}

async function initializeSupabase() {
  return supabase;
}

async function initializeKV() {
  return kv;
}

async function initializeLiveKit() {
  return livekitRoutes;
}

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

// ============= UTILITY FUNCTIONS =============

// 🔥 Validar se ID é UUID válido
function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// ============= ROTAS PÚBLICAS (SEM AUTENTICAÇÃO) =============
// IMPORTANTE: Estas rotas são 100% PÚBLICAS para o Google

// SITEMAP.XML - 100% PÚBLICO
app.get('/make-server-0ea22bba/sitemap.xml', (c) => {
  console.log('📄 ✅ Sitemap.xml acessado (PÚBLICO - SEM AUTENTICAÇÃO)');
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Homepage -->
  <url>
    <loc>https://volleypro-zw96.vercel.app/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Feed -->
  <url>
    <loc>https://volleypro-zw96.vercel.app/#feed</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Atletas / Vitrine -->
  <url>
    <loc>https://volleypro-zw96.vercel.app/#showcase</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Times -->
  <url>
    <loc>https://volleypro-zw96.vercel.app/#teams</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Torneios -->
  <url>
    <loc>https://volleypro-zw96.vercel.app/#tournaments</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Lives -->
  <url>
    <loc>https://volleypro-zw96.vercel.app/#lives</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Planos -->
  <url>
    <loc>https://volleypro-zw96.vercel.app/#monetization</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

</urlset>`;

  return c.body(sitemap, 200, {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
});

// ROBOTS.TXT - 100% PÚBLICO
app.get('/make-server-0ea22bba/robots.txt', (c) => {
  console.log('🤖 ✅ Robots.txt acessado (PÚBLICO - SEM AUTENTICAÇÃO)');
  
  const robots = `# VolleyPro - Rede Social de Vôlei
User-agent: *
Allow: /
Sitemap: https://waibxabxlcbfyxyagaow.supabase.co/functions/v1/make-server-0ea22bba/sitemap.xml

# Bloquear URLs privadas
Disallow: /admin
Disallow: /*?token=
`;

  return c.body(robots, 200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
});

// ============= MASTER USER CONFIGURATION =============
const MASTER_EMAIL = 'eri.2113@gmail.com';

// Check if user is master
async function isMasterUser(userId: string): Promise<boolean> {
  try {
    const kvStore = await initializeKV();
    const supabaseClient = await initializeSupabase();
    
    const user = await kvStore.get(`user:${userId}`);
    if (!user) return false;
    
    // Check if email matches master email
    const { data: authUser } = await supabaseClient.auth.admin.getUserById(userId);
    return authUser?.user?.email === MASTER_EMAIL;
  } catch (error) {
    console.error('Error checking master user:', error);
    return false;
  }
}

// Initialize storage bucket for avatars on startup
async function initStorage() {
  try {
    const supabaseClient = await initializeSupabase();
    
    if (!supabaseClient || !supabaseClient.storage) {
      console.log('⚠️ Skipping avatar storage initialization - Supabase not available');
      return;
    }
    
    const bucketName = 'make-0ea22bba-avatars';
    const { data: buckets } = await supabaseClient.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log('📦 Creating avatars bucket...');
      const { data, error } = await supabaseClient.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB\n        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']
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

// Initialize on startup (after modules are loaded)
setTimeout(() => {
  if (supabase) {
    initStorage();
  } else {
    console.log('⚠️ Skipping storage initialization - Supabase not available');
  }
}, 100);

// Auth middleware (required auth)
async function authMiddleware(c: any, next: any) {
  const authHeader = c.req.header('Authorization');
  console.log('🔐 Auth header present:', Boolean(authHeader));
  
  const accessToken = authHeader?.split(' ')[1];
  
  // Se não tem token, tentar usar o anon key (não autenticado)
  if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
    console.log('❌ No valid access token provided');
    return c.json({ error: 'Unauthorized - No token provided' }, 401);
  }
  
  try {
    const supabaseClient = await initializeSupabase();
    
    // Check if supabase is properly initialized
    if (!supabaseClient || !supabaseClient.auth || !supabaseClient.auth.getUser) {
      console.error('❌ Supabase client not properly initialized (using mock?)');
      return c.json({ 
        error: 'Service temporarily unavailable - Auth not configured',
        code: 'SERVICE_INIT_ERROR'
      }, 503);
    }
    
    const { data: { user }, error } = await supabaseClient.auth.getUser(accessToken);
    
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
        error: 'User not found',
        code: 'USER_NOT_FOUND',
        needsRefresh: true 
      }, 401);
    }
    
    // IMPORTANTE: Verificar se o perfil do usuário existe no KV
    const userProfile = await kv.get(`user:${user.id}`);
    if (!userProfile) {
      console.log('⚠️ User authenticated but profile not found in KV:', user.id);
      // Permitir acesso mesmo sem perfil - será criado depois
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
    const supabaseClient = await initializeSupabase();
    const { data: { user }, error } = await supabaseClient.auth.getUser(accessToken);
    
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

// ============= TOURNAMENT EDITOR ROUTES =============
// Rotas para edição manual de torneios (partidas, chaveamento, etc)
addTournamentEditorRoutes(app, kv, authMiddleware);

// ============= AUTH ROUTES =============

app.post('/make-server-0ea22bba/auth/signup', async (c) => {
  try {
    const supabaseClient = await initializeSupabase();
    const kvStore = await initializeKV();
    const { email, password, name, userType, position, city, nickname } = await c.req.json();
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== 'string' || password.length < 8 || password.length > 128 || typeof name !== 'string' || name.length > 120 || !['athlete', 'team', 'fan'].includes(userType)) {
      return c.json({ error: 'Invalid registration data (minimum password length: 8)' }, 400);
    }
    
    // ⚠️ VALIDAÇÃO: Bloquear domínios obviamente falsos/temporários
    const invalidDomains = ['test.com', 'fake.com', 'exemplo.com', 'temp.com', 'temporario.com', 'teste.com'];
    const emailDomain = email.split('@')[1]?.toLowerCase();
    
    if (invalidDomains.includes(emailDomain)) {
      console.log('⚠️ Blocked fake email domain:', emailDomain);
      return c.json({ 
        error: 'Email inválido. Use um email real (Gmail, Outlook, etc).' 
      }, 400);
    }
    
    // Public signup must use Supabase Auth, not admin.createUser:
    // signUp sends the confirmation email when Confirm Email is enabled.
    const { createClient: createPublicClient } = await import('npm:@supabase/supabase-js');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!anonKey || !supabaseUrl) {
      return c.json({ error: 'Signup is not configured' }, 503);
    }
    const publicClient = createPublicClient(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await publicClient.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: { data: { name, userType } },
    });

    if (error) {
      console.log('Signup error:', error);
      
      // Detectar erro de email já cadastrado e retornar mensagem amigável
      if (error.message?.includes('already') || error.message?.includes('duplicate') || error.code === '23505') {
        return c.json({ error: 'User already registered' }, 400);
      }
      
      return c.json({ error: error.message }, 400);
    }

    if (!data.user) return c.json({ error: 'Signup did not return a user' }, 502);
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

    await kvStore.set(`user:${data.user.id}`, profile);

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
    const kvStore = await initializeKV();
    const userId = c.get('userId');
    const profile = await kvStore.get(`user:${userId}`);
    
    if (!profile) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Retornar no formato esperado pelo frontend
    return c.json({ 
      user: profile,
      profile: profile,
      userType: profile.userType
    });
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

// 🆕 BUSCAR ATLETA POR CPF (para convocações de times)
app.get('/make-server-0ea22bba/users/search/cpf/:cpf', authMiddleware, async (c) => {
  try {
    const cpf = c.req.param('cpf');
    console.log('🔍 [SEARCH CPF] Buscando atleta por CPF:', cpf);
    
    if (!cpf || cpf.length !== 11) {
      console.log('❌ [SEARCH CPF] CPF inválido:', cpf);
      return c.json({ error: 'CPF inválido. Deve conter 11 dígitos.' }, 400);
    }
    
    // Buscar todos os usuários e filtrar por CPF
    const kvStore = await initializeKV();
    const allUsers = await kvStore.getByPrefix('user:');
    
    console.log(`🔍 [SEARCH CPF] Total de usuários no sistema: ${allUsers.length}`);
    
    // Filtrar por CPF
    const userWithCPF = allUsers.find((user: any) => {
      return user.cpf === cpf;
    });
    
    if (!userWithCPF) {
      console.log('❌ [SEARCH CPF] Nenhum atleta encontrado com CPF:', cpf);
      return c.json({ 
        error: 'Atleta não encontrado',
        message: 'Nenhum atleta cadastrado com este CPF. Certifique-se de que o atleta adicionou o CPF no perfil.'
      }, 404);
    }
    
    console.log('✅ [SEARCH CPF] Atleta encontrado:', userWithCPF.name);
    
    // Retornar dados públicos do atleta
    return c.json({
      id: userWithCPF.id,
      name: userWithCPF.name,
      nickname: userWithCPF.nickname,
      userType: userWithCPF.userType,
      position: userWithCPF.position,
      height: userWithCPF.height,
      age: userWithCPF.age,
      photoUrl: userWithCPF.photoUrl,
      currentTeam: userWithCPF.currentTeam,
      verified: userWithCPF.verified || false
    });
  } catch (error: any) {
    console.error('❌ [SEARCH CPF] Erro ao buscar atleta:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.put('/make-server-0ea22bba/users/:userId', authMiddleware, async (c) => {
  try {
    const userId = c.req.param('userId');
    const currentUserId = c.get('userId');
    
    console.log('📝 [UPDATE USER] Request received:', {
      userId,
      currentUserId,
      match: userId === currentUserId
    });
    
    if (userId !== currentUserId) {
      console.error('❌ [UPDATE USER] Unauthorized: userId mismatch');
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    const updates = await c.req.json();
    console.log('📝 [UPDATE USER] Updates received:', JSON.stringify(updates, null, 2));
    
    const profile = await kv.get(`user:${userId}`);
    
    if (!profile) {
      console.error('❌ [UPDATE USER] User not found:', userId);
      return c.json({ error: 'User not found' }, 404);
    }
    
    console.log('📝 [UPDATE USER] Current profile:', JSON.stringify(profile, null, 2));
    
    // Garantir que altura e peso sejam números se fornecidos
    if (updates.height !== undefined && updates.height !== null) {
      updates.height = typeof updates.height === 'number' ? updates.height : parseInt(updates.height) || null;
    }
    if (updates.weight !== undefined && updates.weight !== null) {
      updates.weight = typeof updates.weight === 'number' ? updates.weight : parseFloat(updates.weight) || null;
    }
    
    const updatedProfile = { ...profile, ...updates };
    
    console.log('📝 [UPDATE USER] Saving updated profile:', JSON.stringify(updatedProfile, null, 2));
    
    await kv.set(`user:${userId}`, updatedProfile);
    
    console.log('✅ [UPDATE USER] Profile updated successfully!');
    
    return c.json({ profile: updatedProfile });
  } catch (error: any) {
    console.error('❌ [UPDATE USER] Error:', error);
    console.error('❌ [UPDATE USER] Stack:', error.stack);
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

// Delete post (user can delete their own posts)
app.delete('/make-server-0ea22bba/posts/:postId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const postId = c.req.param('postId');
    
    // Get post to check ownership
    const post = await kv.get(`post:${postId}`);
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }
    
    // Check if user owns the post
    if (post.authorId !== userId) {
      return c.json({ error: 'You can only delete your own posts' }, 403);
    }
    
    // Delete the post
    await kv.del(`post:${postId}`);
    
    // Delete all comments for this post
    const comments = await kv.getByPrefix(`comment:${postId}:`);
    for (const comment of comments) {
      await kv.del(`comment:${postId}:${comment.id}`);
    }
    
    // Delete all likes for this post
    const likes = await kv.getByPrefix(`like:${postId}:`);
    for (const like of likes) {
      await kv.del(`like:${postId}:${like.userId}`);
    }
    
    console.log('✅ Post deleted:', postId);
    return c.json({ success: true, message: 'Post deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting post:', error);
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
  if (!supabase) {
    console.log('⚠️ Skipping storage initialization - Supabase not available');
    return;
  }
  
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

// Initialize storage on server start (after modules are loaded)
setTimeout(() => {
  initializeStorage();
}, 100);

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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'video/mp4', 'video/webm'];
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'mp4', 'webm'];
    
    // Get file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    // Log detalhado para debug
    console.log('🔍 Type validation:', {
      received: file.type,
      extension: fileExt,
      isEmpty: file.type === '',
      isNull: file.type === null,
      isUndefined: file.type === undefined,
      length: file.type?.length,
      allowed: allowedTypes
    });
    
    // Se o tipo MIME estiver vazio ou inválido, tentar validar pela extensão
    let isValid = allowedTypes.includes(file.type);
    
    if (!isValid && (!file.type || file.type === '')) {
      console.log('⚠️ MIME type empty, checking extension:', fileExt);
      isValid = fileExt ? allowedExtensions.includes(fileExt) : false;
      if (isValid) {
        console.log('✅ File validated by extension:', fileExt);
      }
    }
    
    if (!isValid) {
      console.error('❌ Invalid file type:', file.type);
      console.error('❌ File name:', file.name);
      console.error('❌ Extension:', fileExt);
      console.error('❌ Type check failed - received:', JSON.stringify(file.type));
      return c.json({ 
        error: 'Invalid file type. Only images and videos are allowed.',
        received: file.type,
        fileName: file.name,
        extension: fileExt,
        allowed: allowedTypes 
      }, 400);
    }
    
    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('❌ File too large:', fileSizeMB, 'MB');
      return c.json({ error: 'File too large. Maximum size is 50MB.' }, 400);
    }
    
    // Generate unique filename (fileExt já foi declarado acima na validação)
    const timestamp = Date.now();
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
    console.log('📸 File name:', file.name);
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    // Validar por MIME type ou extensão (fallback)
    let isValid = allowedTypes.includes(file.type);
    
    if (!isValid && (!file.type || file.type === '')) {
      console.log('⚠️ Avatar MIME type empty, checking extension:', fileExt);
      isValid = fileExt ? allowedExtensions.includes(fileExt) : false;
      if (isValid) {
        console.log('✅ Avatar validated by extension:', fileExt);
      }
    }
    
    if (!isValid) {
      console.error('❌ Invalid avatar file type:', file.type, 'Extension:', fileExt);
      return c.json({ 
        error: 'Invalid file type. Only JPG, PNG, WEBP, and AVIF are allowed.',
        received: file.type,
        extension: fileExt
      }, 400);
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return c.json({ error: 'File too large. Maximum size is 5MB.' }, 400);
    }
    
    // Generate unique filename (fileExt já declarado na linha 1015)
    const timestamp = Date.now();
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
    const { name, startDate, endDate, location, maxTeams, modalityType, teamSize, arena, format } = await c.req.json();
    
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
      createdBy: userId, // ✅ Adicionar campo createdBy para consistência
      organizerName: userProfile.name,
      startDate,
      endDate,
      location,
      arena: arena || undefined, // Arena para vôlei de praia
      maxTeams: maxTeams || 16,
      format: format || 'single_elimination', // Formato do torneio
      modalityType: modalityType || 'indoor', // indoor ou beach
      teamSize: teamSize || 'duo', // Para vôlei de praia: duo, trio, quartet, quintet
      registeredTeams: [], // Lista de times registrados
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(tournamentKey, tournament);
    console.log(`✅ Tournament created: ${tournamentKey} - ${name} (${modalityType || 'indoor'})`);
    
    return c.json({ tournament });
  } catch (error: any) {
    console.log('Error creating tournament:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= TOURNAMENT ORGANIZERS ROUTES =============

// Check if user can edit tournament
app.get('/make-server-0ea22bba/tournaments/:tournamentId/can-edit', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    
    // Validar UUID
    if (!isValidUUID(tournamentId)) {
      return c.json({ error: 'Invalid tournament ID' }, 400);
    }
    
    // Buscar torneio
    const tournament = await kv.get(`tournament:${tournamentId}`);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    // Verificar se é criador
    const isCreator = tournament.organizerId === userId;
    
    // Verificar se é organizador
    const organizers = await kv.getByPrefix(`tournament_organizer:${tournamentId}:${userId}:`);
    const isOrganizer = organizers.length > 0;
    
    const canEdit = isCreator || isOrganizer;
    
    return c.json({ 
      canEdit,
      isCreator,
      isOrganizer,
      role: isCreator ? 'creator' : (isOrganizer ? 'organizer' : null)
    });
  } catch (error: any) {
    console.error('❌ Error checking edit permissions:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get tournament organizers (equipe organizadora)
app.get('/make-server-0ea22bba/tournaments/:tournamentId/organizers', authMiddleware, async (c) => {
  try {
    const tournamentId = c.req.param('tournamentId');
    
    // Buscar todos os organizadores do torneio
    const organizers = await kv.getByPrefix(`tournament_organizer:${tournamentId}:`);
    
    console.log(`📋 Organizers loaded for tournament ${tournamentId}:`, organizers.length);
    
    return c.json({ organizers: organizers || [] });
  } catch (error: any) {
    console.error('❌ Error fetching tournament organizers:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Add organizer to tournament
app.post('/make-server-0ea22bba/tournaments/:tournamentId/organizers', authMiddleware, async (c) => {
  try {
    const currentUserId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const { userId, name, email, cpf, type } = await c.req.json();
    
    // Verificar se o usuário atual é o criador do torneio
    const tournament = await kv.get(`tournament:${tournamentId}`);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    if (tournament.organizerId !== currentUserId) {
      return c.json({ error: 'Only the tournament creator can add organizers' }, 403);
    }
    
    // Verificar se já é organizador
    const existingOrganizers = await kv.getByPrefix(`tournament_organizer:${tournamentId}:${userId}`);
    if (existingOrganizers.length > 0) {
      return c.json({ error: 'This person is already an organizer' }, 400);
    }
    
    // Criar novo organizador
    const organizerId = crypto.randomUUID();
    const organizer = {
      id: organizerId,
      userId,
      name,
      email: email || null,
      cpf: cpf || null,
      type: type || null,
      role: 'organizer',
      addedAt: new Date().toISOString()
    };
    
    await kv.set(`tournament_organizer:${tournamentId}:${userId}:${organizerId}`, organizer);
    
    console.log(`✅ Organizer added to tournament ${tournamentId}:`, name);
    
    return c.json({ success: true, organizer });
  } catch (error: any) {
    console.error('❌ Error adding tournament organizer:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Remove organizer from tournament
app.delete('/make-server-0ea22bba/tournaments/:tournamentId/organizers/:organizerId', authMiddleware, async (c) => {
  try {
    const currentUserId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const organizerId = c.req.param('organizerId');
    
    // Verificar se o usuário atual é o criador do torneio
    const tournament = await kv.get(`tournament:${tournamentId}`);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    if (tournament.organizerId !== currentUserId) {
      return c.json({ error: 'Only the tournament creator can remove organizers' }, 403);
    }
    
    // Buscar o organizador para deletar
    const allOrganizers = await kv.getByPrefix(`tournament_organizer:${tournamentId}:`);
    const organizerToDelete = allOrganizers.find((org: any) => org.id === organizerId);
    
    if (!organizerToDelete) {
      return c.json({ error: 'Organizer not found' }, 404);
    }
    
    // Deletar organizador
    await kv.del(`tournament_organizer:${tournamentId}:${organizerToDelete.userId}:${organizerId}`);
    
    console.log(`✅ Organizer removed from tournament ${tournamentId}`);
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error removing tournament organizer:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Check if user is organizer of tournament
app.get('/make-server-0ea22bba/tournaments/:tournamentId/is-organizer', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    
    // Verificar se é criador
    const tournament = await kv.get(`tournament:${tournamentId}`);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    if (tournament.organizerId === userId) {
      return c.json({ isOrganizer: true, isCreator: true, role: 'creator' });
    }
    
    // Verificar se é membro da equipe organizadora
    const organizers = await kv.getByPrefix(`tournament_organizer:${tournamentId}:${userId}:`);
    
    if (organizers.length > 0) {
      return c.json({ isOrganizer: true, isCreator: false, role: 'organizer' });
    }
    
    return c.json({ isOrganizer: false, isCreator: false, role: null });
  } catch (error: any) {
    console.error('❌ Error checking organizer status:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Search people (for adding to organizer team)
app.get('/make-server-0ea22bba/search/people', authMiddleware, async (c) => {
  try {
    const query = c.req.query('q')?.toLowerCase() || '';
    
    if (query.length < 2) {
      return c.json({ people: [] });
    }
    
    // Buscar todos os usuários
    const allUsers = await kv.getByPrefix('user:');
    
    // Filtrar por nome ou CPF
    const filteredUsers = allUsers.filter((user: any) => {
      if (!user.name) return false;
      
      const nameMatch = user.name.toLowerCase().includes(query);
      const cpfMatch = user.cpf && user.cpf.replace(/\D/g, '').includes(query.replace(/\D/g, ''));
      
      return nameMatch || cpfMatch;
    });
    
    // Limitar a 20 resultados e retornar apenas dados necessários
    const results = filteredUsers.slice(0, 20).map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      type: user.userType,
      photoUrl: user.photoUrl
    }));
    
    return c.json({ people: results });
  } catch (error: any) {
    console.error('❌ Error searching people:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update tournament match result (for organizers)
app.put('/make-server-0ea22bba/tournaments/:tournamentId/matches/:matchId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const matchId = c.req.param('matchId');
    const { team1Score, team2Score, winnerId, sets } = await c.req.json();
    
    // Verificar se é organizador
    const tournament = await kv.get(`tournament:${tournamentId}`);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    const isCreator = tournament.organizerId === userId;
    const organizers = await kv.getByPrefix(`tournament_organizer:${tournamentId}:${userId}:`);
    const isOrganizer = isCreator || organizers.length > 0;
    
    if (!isOrganizer) {
      return c.json({ error: 'Only tournament organizers can update matches' }, 403);
    }
    
    // Atualizar partida
    const matchKey = `tournament_match:${tournamentId}:${matchId}`;
    const match = await kv.get(matchKey);
    
    if (!match) {
      return c.json({ error: 'Match not found' }, 404);
    }
    
    match.team1Score = team1Score;
    match.team2Score = team2Score;
    match.winnerId = winnerId;
    match.sets = sets || [];
    match.status = 'finished';
    match.updatedBy = userId;
    match.updatedAt = new Date().toISOString();
    
    await kv.set(matchKey, match);
    
    console.log(`✅ Match ${matchId} updated in tournament ${tournamentId}`);
    
    return c.json({ success: true, match });
  } catch (error: any) {
    console.error('❌ Error updating match:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update tournament standings (for organizers)
app.put('/make-server-0ea22bba/tournaments/:tournamentId/standings', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const { standings } = await c.req.json();
    
    // Verificar se é organizador
    const tournament = await kv.get(`tournament:${tournamentId}`);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    const isCreator = tournament.organizerId === userId;
    const organizers = await kv.getByPrefix(`tournament_organizer:${tournamentId}:${userId}:`);
    const isOrganizer = isCreator || organizers.length > 0;
    
    if (!isOrganizer) {
      return c.json({ error: 'Only tournament organizers can update standings' }, 403);
    }
    
    // Atualizar classificação
    tournament.standings = standings;
    tournament.updatedBy = userId;
    tournament.updatedAt = new Date().toISOString();
    
    await kv.set(`tournament:${tournamentId}`, tournament);
    
    console.log(`✅ Standings updated for tournament ${tournamentId}`);
    
    return c.json({ success: true, tournament });
  } catch (error: any) {
    console.error('❌ Error updating standings:', error);
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

// ============= TOURNAMENTS ROUTES =============

// Get all tournaments
app.get('/make-server-0ea22bba/tournaments', async (c) => {
  try {
    const status = c.req.query('status');
    const allTournaments = await kv.getByPrefix('tournament:');
    
    // 🔥 FILTRAR APENAS TORNEIOS COM UUIDs VÁLIDOS (remover IDs numéricos antigos)
    const validTournaments = allTournaments.filter((t: any) => isValidUUID(t.id));
    
    let tournaments = validTournaments;
    if (status) {
      tournaments = validTournaments.filter((t: any) => t.status === status);
    }
    
    // Sort by creation date, newest first
    tournaments.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    console.log(`📋 Returning ${tournaments.length} tournaments (filtered ${allTournaments.length - validTournaments.length} invalid)`);
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
    
    // 🔥 VALIDAR UUID: Rejeitar IDs antigos (numéricos)
    const cleanId = id.replace('tournament:', '');
    
    if (!isValidUUID(cleanId)) {
      console.warn('⚠️ ID de torneio inválido (não é UUID):', id);
      return c.json({ error: 'Invalid tournament ID format' }, 400);
    }
    
    // Verificar se já tem o prefixo 'tournament:'
    const tournamentId = id.startsWith('tournament:') ? id : `tournament:${id}`;
    const baseId = id.replace('tournament:', ''); // ID sem prefixo para matches
    
    console.log(`📋 Buscando torneio: ${tournamentId}`);
    const tournament = await kv.get(tournamentId);
    
    if (!tournament) {
      console.warn(`⚠️ Torneio não encontrado: ${tournamentId}`);
      return c.json({ error: 'Tournament not found' }, 404);
    }

    console.log(`✅ Torneio encontrado: ${tournament.name}`);
    
    // 🔍 DEBUG: Ver estrutura do torneio
    console.log('🔍 DEBUG Torneio:', JSON.stringify({
      id: tournament.id,
      name: tournament.name,
      modalityType: tournament.modalityType,
      registeredTeamsType: Array.isArray(tournament.registeredTeams) ? 'array' : typeof tournament.registeredTeams,
      registeredTeamsLength: tournament.registeredTeams?.length,
      registeredTeamsSample: tournament.registeredTeams?.slice(0, 2),
      individualRegistrationsLength: tournament.individualRegistrations?.length
    }, null, 2));
    
    // Get matches for this tournament (usar baseId sem prefixo)
    const allMatches = await kv.getByPrefix(`match:${baseId}:`);
    
    console.log(`📋 ${allMatches?.length || 0} partidas encontradas`);
    
    // Get registered teams details
    // 🏖️ Para torneios de PRAIA: registeredTeams já contém objetos completos
    // 🏐 Para torneios de QUADRA: usar squadRegistrations (cada equipe é um participante)
    let teamsDetails = [];
    
    if (tournament.modalityType === 'beach') {
      // Torneio de praia: registeredTeams já são objetos completos
      teamsDetails = tournament.registeredTeams || [];
      console.log(`🏖️ Torneio de praia: ${teamsDetails.length} duplas/equipes inscritas`);
    } else {
      // Torneio de quadra: usar squadRegistrations (cada equipe conta individualmente)
      if (tournament.squadRegistrations && tournament.squadRegistrations.length > 0) {
        // Retornar as squadRegistrations completas (já têm teamName, squadName, players, etc)
        teamsDetails = tournament.squadRegistrations;
        console.log(`🏐 Torneio de quadra: ${teamsDetails.length} equipes inscritas (squadRegistrations)`);
      } else {
        // Fallback para registeredTeams (legado)
        teamsDetails = await Promise.all(
          (tournament.registeredTeams || []).map(async (teamId: string) => {
            const team = await kv.get(`user:${teamId}`);
            return team;
          })
        );
        console.log(`🏐 Torneio de quadra (legado): ${teamsDetails.filter(Boolean).length} times encontrados`);
      }
    }
    
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
    const body = await c.req.json().catch(() => ({}));
    const teamId = body.teamId || userId; // Usar teamId do body ou userId como fallback
    
    console.log('🗑️ ====== CANCELAR INSCRIÇÃO ======');
    console.log('Tournament ID:', tournamentId);
    console.log('Team ID:', teamId);
    
    const tournamentKey = `tournament:${tournamentId}`;
    const tournament = await kv.get(tournamentKey);
    if (!tournament) {
      console.log('❌ Tournament not found');
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    if (tournament.status !== 'upcoming') {
      console.log('❌ Cannot unregister from ongoing tournament');
      return c.json({ error: 'Cannot unregister from ongoing tournament' }, 400);
    }
    
    let removedFromLegacy = false;
    let removedFromSquads = false;
    
    // ✅ REMOVER DO ARRAY LEGADO (registeredTeams)
    const registeredTeams = tournament.registeredTeams || [];
    const legacyIndex = registeredTeams.indexOf(teamId);
    if (legacyIndex !== -1) {
      registeredTeams.splice(legacyIndex, 1);
      tournament.registeredTeams = registeredTeams;
      removedFromLegacy = true;
      console.log('✅ Removido do array LEGADO (registeredTeams)');
    }
    
    // ✅ REMOVER DO ARRAY NOVO (squadRegistrations)
    const squadRegistrations = tournament.squadRegistrations || [];
    const squadIndex = squadRegistrations.findIndex((reg: any) => reg.teamId === teamId);
    if (squadIndex !== -1) {
      squadRegistrations.splice(squadIndex, 1);
      tournament.squadRegistrations = squadRegistrations;
      removedFromSquads = true;
      console.log('✅ Removido do array NOVO (squadRegistrations)');
    }
    
    // Verificar se foi removido de pelo menos um array
    if (!removedFromLegacy && !removedFromSquads) {
      console.log('❌ Team not found in any array:', {
        registeredTeams,
        squadRegistrations
      });
      return c.json({ error: 'Team not registered' }, 400);
    }
    
    // Salvar torneio atualizado
    await kv.set(tournamentKey, tournament);
    
    console.log(`✅ Team ${teamId} unregistered from tournament ${tournamentId}`);
    console.log('Removido de:', {
      legacyArray: removedFromLegacy,
      squadArray: removedFromSquads
    });
    console.log('=====================================\n');
    
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

// Create match in tournament (organizer only)
app.post('/make-server-0ea22bba/tournaments/:tournamentId/matches', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const matchData = await c.req.json();
    
    console.log('📝 Creating match for tournament:', tournamentId);
    
    const tournamentKey = `tournament:${tournamentId}`;
    const tournament = await kv.get(tournamentKey);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    // Verificar se é o organizador
    if (tournament.createdBy !== userId && tournament.organizerId !== userId) {
      return c.json({ error: 'Only organizer can create matches' }, 403);
    }
    
    // Gerar ID da partida
    const matchId = `match:${tournamentId}:${crypto.randomUUID()}`;
    
    const match = {
      id: matchId,
      tournamentId,
      round: matchData.round || 'group',
      teamA: matchData.teamA,
      teamB: matchData.teamB,
      teamALogo: matchData.teamALogo,
      teamBLogo: matchData.teamBLogo,
      scheduledDate: matchData.scheduledDate,
      scheduledTime: matchData.scheduledTime,
      court: matchData.court,
      category: matchData.category,
      sets: matchData.sets || { teamA: [], teamB: [] },
      status: matchData.status || 'scheduled',
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(matchId, match);
    
    console.log(`✅ Match created: ${matchId}`);
    
    return c.json({ match });
  } catch (error: any) {
    console.error('❌ Error creating match:', error);
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
      id: voteKey, // Adicionar ID para facilitar deleção
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
// (A rota /admin/reset-tournaments está mais abaixo com autenticação)

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
      console.log('⚠️ Convite bloqueado: Atleta sem CPF', { athleteId, athleteName: athlete.name });
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
    console.log('✅ Convite enviado com sucesso!', { 
      invitationId, 
      team: team.name, 
      athlete: athlete.name,
      cpf: athlete.cpf 
    });
    
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
    
    console.log('✅ ACEITAR CONVITE - Início:', { userId, invitationId });
    
    const invitation = await kv.get(invitationId);
    
    if (!invitation) {
      console.log('❌ CONVITE NÃO ENCONTRADO:', invitationId);
      return c.json({ error: 'Invitation not found' }, 404);
    }
    
    console.log('📧 Convite encontrado:', invitation);
    
    if (invitation.athleteId !== userId) {
      console.log('⛔ USUÁRIO NÃO AUTORIZADO:', { athleteId: invitation.athleteId, userId });
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    if (invitation.status !== 'pending') {
      console.log('⚠️ CONVITE JÁ PROCESSADO:', invitation.status);
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
    
    // ✅ NOVO: Remover da vitrine automaticamente
    athlete.freeAgent = false;
    
    await kv.set(`user:${userId}`, athlete);
    
    // ✅ NOVO: Adicionar ao elenco do time automaticamente
    const teamId = invitation.teamId;
    const teamPlayers = await kv.get(`team:${teamId}:players`) || [];
    
    // Verificar se atleta já não está no elenco
    const alreadyInRoster = teamPlayers.find((p: any) => p.id === userId);
    
    if (!alreadyInRoster) {
      const newPlayer = {
        id: userId,
        name: athlete.name,
        position: athlete.position || 'Posição não definida',
        number: teamPlayers.length + 1,
        age: athlete.age,
        height: athlete.height,
        photoUrl: athlete.photoUrl,
        cpf: athlete.cpf,
        addedAt: new Date().toISOString(),
        teamId: teamId
      };
      
      teamPlayers.push(newPlayer);
      await kv.set(`team:${teamId}:players`, teamPlayers);
      
      console.log(`✅ Player added to team roster: ${athlete.name} → ${invitation.teamName}`);
    }
    
    console.log(`✅✅✅ CONVITE ACEITO COM SUCESSO!`, {
      athlete: athlete.name,
      team: invitation.teamName,
      teamId: invitation.teamId,
      cpf: athlete.cpf
    });
    
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
    
    console.log('❌ REJEITAR CONVITE - Início:', { userId, invitationId });
    
    const invitation = await kv.get(invitationId);
    
    if (!invitation) {
      console.log('❌ CONVITE NÃO ENCONTRADO:', invitationId);
      return c.json({ error: 'Invitation not found' }, 404);
    }
    
    console.log('📧 Convite encontrado:', invitation);
    
    if (invitation.athleteId !== userId) {
      console.log('⛔ USUÁRIO NÃO AUTORIZADO:', { athleteId: invitation.athleteId, userId });
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    if (invitation.status !== 'pending') {
      console.log('⚠️ CONVITE JÁ PROCESSADO:', invitation.status);
      return c.json({ error: 'Invitation already processed' }, 400);
    }
    
    // Update invitation status
    invitation.status = 'rejected';
    invitation.rejectedAt = new Date().toISOString();
    await kv.set(invitationId, invitation);
    
    console.log(`❌❌❌ CONVITE REJEITADO!`, {
      athlete: userId,
      team: invitation.teamName
    });
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error rejecting invitation:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= TEAM REQUESTS (Athlete requests to join team) =============

// Create team request (athlete requests to join a team)
app.post('/make-server-0ea22bba/teams/:teamId/request', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const teamId = c.req.param('teamId');
    const { message } = await c.req.json();
    
    console.log('📩 SOLICITAÇÃO PARA TIME - Início:', { athleteId: userId, teamId });
    
    // Get athlete info
    const athlete = await kv.get(`user:${userId}`);
    if (!athlete || athlete.userType !== 'athlete') {
      return c.json({ error: 'Only athletes can request to join teams' }, 403);
    }
    
    // Get team info
    const team = await kv.get(`user:${teamId}`);
    if (!team || team.userType !== 'team') {
      return c.json({ error: 'Team not found' }, 404);
    }
    
    // Check if athlete already has a team
    if (athlete.currentTeam) {
      return c.json({ 
        error: 'Você já faz parte de um time. Saia do time atual antes de solicitar participar de outro.',
        currentTeam: athlete.currentTeam
      }, 400);
    }
    
    // Check if there's already a pending request
    const existingRequests = await kv.getByPrefix('teamrequest:');
    const pendingRequest = existingRequests.find((req: any) => 
      req.athleteId === userId && 
      req.teamId === teamId && 
      req.status === 'pending'
    );
    
    if (pendingRequest) {
      return c.json({ error: 'Você já enviou uma solicitação para este time' }, 400);
    }
    
    // Create request
    const requestId = `teamrequest:${crypto.randomUUID()}`;
    const request = {
      id: requestId,
      athleteId: userId,
      athleteName: athlete.name,
      athletePosition: athlete.position || 'Não definida',
      athleteHeight: athlete.height,
      athleteAge: athlete.age,
      athletePhotoUrl: athlete.photoUrl,
      athleteCpf: athlete.cpf,
      teamId: teamId,
      teamName: team.name,
      message: message || `Olá! Gostaria de fazer parte do ${team.name}.`,
      status: 'pending', // pending, accepted, rejected
      createdAt: new Date().toISOString()
    };
    
    await kv.set(requestId, request);
    
    console.log('✅ Solicitação criada:', request);
    
    return c.json({ 
      success: true,
      request,
      message: `Solicitação enviada para ${team.name}!`
    });
  } catch (error: any) {
    console.error('❌ Error creating team request:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get requests for a team (team sees who wants to join)
app.get('/make-server-0ea22bba/teams/requests', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const allRequests = await kv.getByPrefix('teamrequest:');
    
    const teamRequests = allRequests.filter((req: any) => 
      req.teamId === userId && req.status === 'pending'
    );
    
    console.log(`📩 ${teamRequests.length} solicitações pendentes para o time ${userId}`);
    
    return c.json({ requests: teamRequests });
  } catch (error: any) {
    console.error('❌ Error getting team requests:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get requests sent by athlete
app.get('/make-server-0ea22bba/athlete/requests', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const allRequests = await kv.getByPrefix('teamrequest:');
    
    const athleteRequests = allRequests.filter((req: any) => 
      req.athleteId === userId
    );
    
    return c.json({ requests: athleteRequests });
  } catch (error: any) {
    console.error('❌ Error getting athlete requests:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Accept team request (team accepts athlete)
app.post('/make-server-0ea22bba/teams/requests/:requestId/accept', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const requestId = c.req.param('requestId');
    
    console.log('✅ ACEITAR SOLICITAÇÃO - Início:', { teamId: userId, requestId });
    
    const request = await kv.get(requestId);
    
    if (!request) {
      return c.json({ error: 'Request not found' }, 404);
    }
    
    if (request.teamId !== userId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    if (request.status !== 'pending') {
      return c.json({ error: 'Request already processed' }, 400);
    }
    
    // Get athlete
    const athlete = await kv.get(`user:${request.athleteId}`);
    if (!athlete) {
      return c.json({ error: 'Athlete not found' }, 404);
    }
    
    // Check if athlete already joined another team
    if (athlete.currentTeam) {
      request.status = 'rejected';
      request.rejectedReason = 'Atleta já entrou em outro time';
      request.rejectedAt = new Date().toISOString();
      await kv.set(requestId, request);
      
      return c.json({ 
        error: 'Este atleta já faz parte de outro time',
        currentTeam: athlete.currentTeam
      }, 400);
    }
    
    // Update request status
    request.status = 'accepted';
    request.acceptedAt = new Date().toISOString();
    await kv.set(requestId, request);
    
    // Update athlete's current team
    athlete.currentTeam = request.teamName;
    await kv.set(`user:${request.athleteId}`, athlete);
    
    // Add athlete to team roster
    const teamPlayers = await kv.get(`team:${userId}:players`) || [];
    const newPlayer = {
      id: request.athleteId,
      name: athlete.name,
      position: athlete.position || 'Posição não definida',
      number: teamPlayers.length + 1,
      age: athlete.age,
      height: athlete.height,
      photoUrl: athlete.photoUrl,
      cpf: athlete.cpf,
      addedAt: new Date().toISOString(),
      teamId: userId
    };
    
    teamPlayers.push(newPlayer);
    await kv.set(`team:${userId}:players`, teamPlayers);
    
    console.log(`✅✅✅ SOLICITAÇÃO ACEITA!`, {
      athlete: athlete.name,
      team: request.teamName
    });
    
    return c.json({ 
      success: true,
      athlete,
      message: `${athlete.name} agora faz parte do time!`
    });
  } catch (error: any) {
    console.error('❌ Error accepting team request:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Reject team request
app.post('/make-server-0ea22bba/teams/requests/:requestId/reject', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const requestId = c.req.param('requestId');
    
    const request = await kv.get(requestId);
    
    if (!request) {
      return c.json({ error: 'Request not found' }, 404);
    }
    
    if (request.teamId !== userId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    if (request.status !== 'pending') {
      return c.json({ error: 'Request already processed' }, 400);
    }
    
    request.status = 'rejected';
    request.rejectedAt = new Date().toISOString();
    await kv.set(requestId, request);
    
    console.log(`❌ Solicitação rejeitada:`, {
      athlete: request.athleteName,
      team: request.teamName
    });
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error rejecting team request:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Cancel team request (athlete cancels their own request)
app.delete('/make-server-0ea22bba/teams/requests/:requestId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const requestId = c.req.param('requestId');
    
    const request = await kv.get(requestId);
    
    if (!request) {
      return c.json({ error: 'Request not found' }, 404);
    }
    
    if (request.athleteId !== userId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    await kv.del(requestId);
    
    console.log(`🗑️ Solicitação cancelada pelo atleta:`, {
      athlete: request.athleteName,
      team: request.teamName
    });
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error canceling team request:', error);
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

// ============= TEAM ROSTER MANAGEMENT ROUTES =============

// Get team roster/elenco
app.get('/make-server-0ea22bba/teams/:teamId/players', async (c) => {
  try {
    const teamId = c.req.param('teamId');
    
    console.log(`🔍 Getting roster for team: ${teamId}`);
    
    // Buscar jogadores do time
    const players = await kv.get(`team:${teamId}:players`) || [];
    
    console.log(`✅ Found ${players.length} players for team ${teamId}`);
    
    return c.json({ players });
  } catch (error: any) {
    console.error('❌ Error getting team roster:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Add player to roster
app.post('/make-server-0ea22bba/teams/:teamId/players', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const teamId = c.req.param('teamId');
    
    // Verificar se o usuário é o dono do time
    if (userId !== teamId) {
      return c.json({ error: 'Only team owner can add players' }, 403);
    }
    
    const { playerId, name, position, number, age, height, photoUrl, cpf } = await c.req.json();
    
    console.log(`➕ Adding player to team ${teamId}:`, { playerId, name, position });
    
    // Buscar jogadores atuais
    const players = await kv.get(`team:${teamId}:players`) || [];
    
    // Criar novo jogador
    const newPlayer = {
      id: playerId || `player:${Date.now()}`,
      name,
      position,
      number: parseInt(number) || 0,
      age: age ? parseInt(age) : undefined,
      height: height ? parseInt(height) : undefined,
      photoUrl: photoUrl || undefined,
      cpf: cpf || undefined,
      addedAt: new Date().toISOString(),
      teamId
    };
    
    // Adicionar à lista
    players.push(newPlayer);
    
    // Salvar no banco
    await kv.set(`team:${teamId}:players`, players);
    
    console.log(`✅ Player added to team ${teamId}: ${newPlayer.name} (${newPlayer.position})`);
    
    return c.json({ player: newPlayer, players });
  } catch (error: any) {
    console.error('❌ Error adding player to roster:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update player in roster
app.put('/make-server-0ea22bba/teams/:teamId/players/:playerId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const teamId = c.req.param('teamId');
    const playerId = c.req.param('playerId');
    
    // Verificar se o usuário é o dono do time
    if (userId !== teamId) {
      return c.json({ error: 'Only team owner can update players' }, 403);
    }
    
    const updates = await c.req.json();
    
    console.log(`✏️ Updating player ${playerId} in team ${teamId}`);
    
    // Buscar jogadores
    let players = await kv.get(`team:${teamId}:players`) || [];
    
    // Encontrar e atualizar jogador
    const playerIndex = players.findIndex((p: any) => p.id === playerId);
    
    if (playerIndex === -1) {
      return c.json({ error: 'Player not found in roster' }, 404);
    }
    
    players[playerIndex] = {
      ...players[playerIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Salvar atualização
    await kv.set(`team:${teamId}:players`, players);
    
    console.log(`✅ Player updated: ${players[playerIndex].name}`);
    
    return c.json({ player: players[playerIndex], players });
  } catch (error: any) {
    console.error('❌ Error updating player:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Remove player from roster
app.delete('/make-server-0ea22bba/teams/:teamId/players/:playerId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const teamId = c.req.param('teamId');
    const playerId = c.req.param('playerId');
    
    // Verificar se o usuário é o dono do time
    if (userId !== teamId) {
      return c.json({ error: 'Only team owner can remove players' }, 403);
    }
    
    console.log(`🗑️ Removing player ${playerId} from team ${teamId}`);
    
    // Buscar jogadores
    let players = await kv.get(`team:${teamId}:players`) || [];
    
    // Encontrar jogador antes de remover (para log)
    const playerToRemove = players.find((p: any) => p.id === playerId);
    
    // Filtrar jogador removido
    players = players.filter((p: any) => p.id !== playerId);
    
    // Salvar atualização
    await kv.set(`team:${teamId}:players`, players);
    
    console.log(`✅ Player removed: ${playerToRemove?.name || playerId}`);
    
    return c.json({ success: true, players });
  } catch (error: any) {
    console.error('❌ Error removing player:', error);
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
    
    // Try multiple variations to find the tournament
    const possibleIds = [
      tournamentIdParam, // As is
      `tournament:${tournamentIdParam}`, // With prefix
      tournamentIdParam.replace('tournament:', ''), // Without prefix
    ];
    
    let tournament = null;
    let tournamentId = '';
    
    // Try each possible ID until we find the tournament
    for (const id of possibleIds) {
      const result = await kv.get(id);
      if (result) {
        tournament = result;
        tournamentId = id;
        break;
      }
    }
    
    if (!tournament) {
      console.error(`❌ Tournament not found. Tried IDs:`, possibleIds);
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
    console.error('��� Error declining callup:', error);
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

// Create tournament (rota principal de criação)
app.post('/make-server-0ea22bba/tournaments', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentData = await c.req.json();
    
    console.log('🏆 Criando novo torneio:', tournamentData);
    
    // Validações
    if (!tournamentData.name || !tournamentData.startDate || !tournamentData.endDate || !tournamentData.location) {
      return c.json({ error: 'Dados obrigatórios faltando' }, 400);
    }
    
    // Buscar dados do usuário
    const user = await kv.get(`user:${userId}`);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Gerar ID seguro com timestamp (SEMPRE 13 dígitos)
    const timestamp = Date.now();
    const tournamentId = `tournament:${timestamp}`;
    
    // Validar que timestamp está em range seguro
    if (timestamp > Number.MAX_SAFE_INTEGER) {
      console.error('❌ Timestamp overflow:', timestamp);
      return c.json({ error: 'Erro ao gerar ID do torneio' }, 500);
    }
    
    console.log(`📌 ID gerado: ${tournamentId} (timestamp: ${timestamp})`);
    
    // Criar torneio
    const newTournament = {
      id: tournamentId,
      name: tournamentData.name,
      description: tournamentData.description || '',
      modalityType: tournamentData.modalityType || 'indoor',
      startDate: tournamentData.startDate,
      endDate: tournamentData.endDate,
      location: tournamentData.location,
      arena: tournamentData.arena,
      city: tournamentData.city || '',
      state: tournamentData.state || '',
      maxTeams: tournamentData.maxTeams || 16,
      registrationDeadline: tournamentData.registrationDeadline,
      status: 'upcoming',
      format: tournamentData.format || 'single_elimination',
      categories: tournamentData.categories || ['masculino'],
      divisions: tournamentData.divisions || ['Adulto'],
      categoryData: {},
      registeredTeams: [],
      squadRegistrations: [],
      registeredPlayers: [],
      organizerName: user.name || user.username,
      organizerAvatar: user.profilePhoto,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      sponsors: []
    };
    
    // Inicializar categoryData
    for (const category of newTournament.categories) {
      newTournament.categoryData[category] = {};
      for (const division of newTournament.divisions) {
        newTournament.categoryData[category][division] = {
          maxTeams: newTournament.maxTeams,
          registeredTeams: []
        };
      }
    }
    
    await kv.set(tournamentId, newTournament);
    
    console.log(`✅ Torneio criado: ${tournamentId} - ${newTournament.name}`);
    
    return c.json({ 
      success: true,
      tournament: newTournament 
    });
  } catch (error: any) {
    console.error('❌ Error creating tournament:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Save tournament category formats
app.post('/make-server-0ea22bba/tournaments/:tournamentId/category-formats', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const { categories } = await c.req.json();
    
    console.log('🎯 Salvando formatos das categorias:', { tournamentId, categories });
    
    // Validações
    if (!categories || !Array.isArray(categories)) {
      return c.json({ error: 'Categories array is required' }, 400);
    }
    
    // Buscar torneio
    const tournament = await kv.get(tournamentId);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    // Verificar permissões
    const canEdit = tournament.createdBy === userId || 
                    tournament.organizingTeam === userId ||
                    (tournament.organizingTeamMembers && tournament.organizingTeamMembers.includes(userId));
    
    if (!canEdit) {
      return c.json({ error: 'You do not have permission to edit this tournament' }, 403);
    }
    
    // Validar categorias
    for (const cat of categories) {
      if (!cat.name || !cat.format) {
        return c.json({ error: 'Each category must have name and format' }, 400);
      }
      
      if (!['groups', 'round_robin'].includes(cat.format)) {
        return c.json({ error: 'Invalid format. Must be "groups" or "round_robin"' }, 400);
      }
      
      if (cat.format === 'groups') {
        if (!cat.numGroups || cat.numGroups < 1) {
          return c.json({ error: `Category ${cat.name}: numGroups must be at least 1` }, 400);
        }
        
        if (cat.advancingPerGroup && cat.advancingPerGroup > cat.teamsPerGroup) {
          return c.json({ error: `Category ${cat.name}: advancingPerGroup cannot exceed teamsPerGroup` }, 400);
        }
      }
    }
    
    // Salvar configuração
    tournament.categoryFormats = categories;
    tournament.updatedAt = new Date().toISOString();
    await kv.set(tournamentId, tournament);
    
    console.log(`✅ Formatos das categorias salvos para: ${tournamentId}`);
    
    return c.json({ 
      success: true,
      categoryFormats: categories
    });
  } catch (error: any) {
    console.error('❌ Error saving category formats:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get tournament category formats
app.get('/make-server-0ea22bba/tournaments/:tournamentId/category-formats', async (c) => {
  try {
    const tournamentId = c.req.param('tournamentId');
    
    const tournament = await kv.get(tournamentId);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    return c.json({ 
      categoryFormats: tournament.categoryFormats || []
    });
  } catch (error: any) {
    console.error('❌ Error getting category formats:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Reset tournaments (criar rota que estava faltando)
app.post('/make-server-0ea22bba/admin/reset-tournaments', async (c) => {
  try {
    console.log('🔄 Resetando todos os torneios...');
    
    // Deletar TODOS os torneios
    const allTournaments = await kv.getByPrefix('tournament:');
    console.log(`🗑️ Deletando ${allTournaments.length} torneios existentes...`);
    
    for (const tournament of allTournaments) {
      await kv.del(tournament.id);
    }
    
    // Deletar todos os matches também
    const allMatches = await kv.getByPrefix('match:');
    console.log(`🗑️ Deletando ${allMatches.length} partidas...`);
    
    for (const match of allMatches) {
      await kv.del(match.id);
    }
    
    // Criar um torneio de exemplo com ID válido usando timestamp
    const tournamentId = `tournament:${Date.now()}`;
    const newTournament = {
      id: tournamentId,
      name: 'Campeonato Municipal 2025',
      description: 'Torneio de exemplo criado pelo sistema',
      modalityType: 'indoor',
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias no futuro
      endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 37 dias no futuro
      location: 'Ginásio Municipal',
      city: 'São Paulo',
      state: 'SP',
      maxTeams: 16,
      registrationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 20 dias no futuro
      status: 'upcoming',
      categories: ['masculino'],
      divisions: ['Adulto'],
      categoryData: {
        masculino: {
          Adulto: {
            maxTeams: 16,
            registeredTeams: []
          }
        }
      },
      registeredTeams: [],
      squadRegistrations: [],
      registeredPlayers: [],
      organizerName: 'Sistema VolleyPro',
      organizerAvatar: 'https://ui-avatars.com/api/?name=VolleyPro&background=0052cc&color=fff',
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      sponsors: []
    };
    
    await kv.set(tournamentId, newTournament);
    
    console.log(`✅ Torneio criado com sucesso: ${tournamentId}`);
    console.log(`📋 Dados do torneio:`, JSON.stringify({
      id: newTournament.id,
      name: newTournament.name,
      status: newTournament.status
    }, null, 2));
    
    return c.json({ 
      success: true,
      message: 'Torneios resetados com sucesso',
      tournament: newTournament
    });
  } catch (error: any) {
    console.error('❌ Error resetting tournaments:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= TOURNAMENT DRAW & SCHEDULE EDITING ROUTES =============

// Get registered teams for tournament draw
app.get('/make-server-0ea22bba/tournaments/:tournamentId/registered-teams', async (c) => {
  try {
    const tournamentId = c.req.param('tournamentId');
    
    // Buscar times inscritos
    const registrations = await kv.getByPrefix(`tournament:${tournamentId}:registration:`);
    
    const teams = registrations
      .filter((reg: any) => reg.status === 'confirmed')
      .map((reg: any) => ({
        id: reg.teamId,
        name: reg.teamName,
        logo: reg.teamLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(reg.teamName)}&background=random`,
        registrationDate: reg.createdAt
      }));
    
    console.log(`✅ Found ${teams.length} registered teams for tournament ${tournamentId}`);
    
    return c.json({ teams });
  } catch (error: any) {
    console.error('❌ Error getting registered teams:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Save tournament draw results
app.post('/make-server-0ea22bba/tournaments/:tournamentId/draw', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const { groups } = await c.req.json();
    
    // Verificar permissão
    const tournament = await kv.get(`tournament:${tournamentId}`);
    const isCreator = tournament?.createdBy === userId;
    const isOrganizer = !!(await kv.get(`tournament:${tournamentId}:organizer:${userId}`));
    
    if (!isCreator && !isOrganizer) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // Salvar resultado do sorteio
    const drawKey = `tournament:${tournamentId}:draw`;
    const drawData = {
      groups,
      drawnBy: userId,
      drawnAt: new Date().toISOString()
    };
    
    await kv.set(drawKey, drawData);
    
    console.log(`✅ Draw saved for tournament ${tournamentId} by ${userId}`);
    
    return c.json({ success: true, draw: drawData });
  } catch (error: any) {
    console.error('❌ Error saving draw:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get tournament draw
app.get('/make-server-0ea22bba/tournaments/:tournamentId/draw', async (c) => {
  try {
    const tournamentId = c.req.param('tournamentId');
    const draw = await kv.get(`tournament:${tournamentId}:draw`);
    
    return c.json({ draw: draw || null });
  } catch (error: any) {
    console.error('❌ Error getting draw:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update match time/schedule
app.patch('/make-server-0ea22bba/tournaments/:tournamentId/matches/:matchId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const matchId = c.req.param('matchId');
    const { date, time, court, location } = await c.req.json();
    
    // Verificar permissão
    const tournament = await kv.get(`tournament:${tournamentId}`);
    const isCreator = tournament?.createdBy === userId;
    const isOrganizer = !!(await kv.get(`tournament:${tournamentId}:organizer:${userId}`));
    
    if (!isCreator && !isOrganizer) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // Buscar partida existente
    const matchKey = `tournament:${tournamentId}:match:${matchId}`;
    const match = await kv.get(matchKey) || {};
    
    // Atualizar dados
    const updatedMatch = {
      ...match,
      id: matchId,
      tournamentId,
      date: date || match.date,
      time: time || match.time,
      court: court || match.court,
      location: location || match.location,
      updatedBy: userId,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(matchKey, updatedMatch);
    
    console.log(`✅ Match ${matchId} updated by ${userId}`);
    
    return c.json({ success: true, match: updatedMatch });
  } catch (error: any) {
    console.error('❌ Error updating match:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= TOURNAMENT EXTERNAL STREAM ROUTES =============

// Get stream configuration for tournament
app.get('/make-server-0ea22bba/tournaments/:tournamentId/stream-config', async (c) => {
  try {
    const tournamentId = c.req.param('tournamentId');
    const streamKey = `tournament:${tournamentId}:stream`;
    
    const config = await kv.get(streamKey);
    
    return c.json({ config: config || null });
  } catch (error: any) {
    console.error('❌ Error getting stream config:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Save stream configuration (organizers only)
app.post('/make-server-0ea22bba/tournaments/:tournamentId/stream-config', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const streamData = await c.req.json();
    
    // Verificar se é organizador
    const tournament = await kv.get(`tournament:${tournamentId}`);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    const isCreator = tournament.organizerId === userId;
    const organizers = await kv.getByPrefix(`tournament_organizer:${tournamentId}:${userId}:`);
    const isOrganizer = organizers.length > 0;
    
    if (!isCreator && !isOrganizer) {
      return c.json({ error: 'Only tournament organizers can configure streams' }, 403);
    }
    
    // Salvar configuração
    const streamKey = `tournament:${tournamentId}:stream`;
    const config = {
      ...streamData,
      organizerId: userId,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(streamKey, config);
    
    console.log(`✅ Stream config saved for tournament ${tournamentId}`);
    
    return c.json({ success: true, config });
  } catch (error: any) {
    console.error('❌ Error saving stream config:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Toggle live status (organizers only)
app.post('/make-server-0ea22bba/tournaments/:tournamentId/stream-toggle', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const { isLive } = await c.req.json();
    
    // Verificar se é organizador
    const tournament = await kv.get(`tournament:${tournamentId}`);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    const isCreator = tournament.organizerId === userId;
    const organizers = await kv.getByPrefix(`tournament_organizer:${tournamentId}:${userId}:`);
    const isOrganizer = organizers.length > 0;
    
    if (!isCreator && !isOrganizer) {
      return c.json({ error: 'Only tournament organizers can toggle stream' }, 403);
    }
    
    // Atualizar status
    const streamKey = `tournament:${tournamentId}:stream`;
    const config = await kv.get(streamKey) || {};
    
    config.isLive = isLive;
    config.startedAt = isLive ? new Date().toISOString() : config.startedAt;
    config.stoppedAt = !isLive ? new Date().toISOString() : undefined;
    
    await kv.set(streamKey, config);
    
    console.log(`✅ Stream ${isLive ? 'started' : 'stopped'} for tournament ${tournamentId}`);
    
    return c.json({ success: true, isLive });
  } catch (error: any) {
    console.error('❌ Error toggling stream:', error);
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

// ============= TEAM CATEGORIES & SQUADS ROUTES =============

// Get all categories and squads for a team
app.get('/make-server-0ea22bba/teams/:teamId/categories', async (c) => {
  try {
    const teamId = c.req.param('teamId');
    
    console.log(`📂 Buscando categorias do time: ${teamId}`);
    
    // Buscar categorias do time
    const categories = await kv.get(`team:${teamId}:categories`) || [];
    
    console.log(`✅ Encontradas ${categories.length} categorias`);
    
    return c.json({ categories });
  } catch (error: any) {
    console.error('❌ Erro ao buscar categorias:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Create new category (Feminino/Masculino)
app.post('/make-server-0ea22bba/teams/:teamId/categories', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const teamId = c.req.param('teamId');
    const { categoryName } = await c.req.json();
    
    console.log(`➕ Criando categoria "${categoryName}" para time ${teamId}`);
    
    // Verificar se é o próprio time
    const user = await kv.get(`user:${userId}`);
    if (!user || user.id !== teamId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // Validar nome da categoria
    if (categoryName !== 'Feminino' && categoryName !== 'Masculino') {
      return c.json({ error: 'Categoria inválida. Use "Feminino" ou "Masculino"' }, 400);
    }
    
    // Buscar categorias existentes
    const categories = await kv.get(`team:${teamId}:categories`) || [];
    
    // Verificar se já existe
    const exists = categories.find((cat: any) => cat.name === categoryName);
    if (exists) {
      return c.json({ error: `Categoria ${categoryName} já existe` }, 400);
    }
    
    // Criar nova categoria
    const newCategory = {
      id: `category:${teamId}:${categoryName.toLowerCase()}`,
      name: categoryName,
      squads: [],
      createdAt: new Date().toISOString()
    };
    
    categories.push(newCategory);
    await kv.set(`team:${teamId}:categories`, categories);
    
    console.log(`✅ Categoria "${categoryName}" criada com sucesso`);
    
    return c.json({ category: newCategory });
  } catch (error: any) {
    console.error('❌ Erro ao criar categoria:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Create new squad within a category
app.post('/make-server-0ea22bba/teams/:teamId/categories/:categoryId/squads', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const teamId = c.req.param('teamId');
    const categoryId = c.req.param('categoryId');
    const { squadName } = await c.req.json();
    
    console.log(`➕ Criando equipe "${squadName}" na categoria ${categoryId}`);
    
    // Verificar se é o próprio time
    const user = await kv.get(`user:${userId}`);
    if (!user || user.id !== teamId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    if (!squadName || squadName.trim().length === 0) {
      return c.json({ error: 'Nome da equipe é obrigatório' }, 400);
    }
    
    // Buscar categorias
    const categories = await kv.get(`team:${teamId}:categories`) || [];
    
    // Encontrar categoria
    const categoryIndex = categories.findIndex((cat: any) => cat.id === categoryId);
    if (categoryIndex === -1) {
      return c.json({ error: 'Categoria não encontrada' }, 404);
    }
    
    const category = categories[categoryIndex];
    
    // Verificar se equipe já existe
    const squadExists = category.squads?.find((s: any) => s.name === squadName);
    if (squadExists) {
      return c.json({ error: `Equipe ${squadName} já existe nesta categoria` }, 400);
    }
    
    // Criar nova equipe
    const timestamp = Date.now();
    const newSquad = {
      id: `squad:${categoryId}:${squadName.replace(/\s+/g, '-').toLowerCase()}:${timestamp}`,
      name: squadName,
      categoryId: category.id,
      categoryName: category.name,
      players: [],
      createdAt: new Date().toISOString(),
      active: true
    };
    
    // Adicionar equipe à categoria
    if (!category.squads) {
      category.squads = [];
    }
    category.squads.push(newSquad);
    
    // Salvar
    categories[categoryIndex] = category;
    await kv.set(`team:${teamId}:categories`, categories);
    
    console.log(`✅ Equipe "${squadName}" criada com sucesso`);
    
    return c.json({ squad: newSquad });
  } catch (error: any) {
    console.error('❌ Erro ao criar equipe:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get squads available for tournament (DEVE VIR ANTES)
app.get('/make-server-0ea22bba/teams/:teamId/squads/available', async (c) => {
  const authHeader = c.req.header('Authorization');
  const accessToken = authHeader?.split(' ')[1];
  if (!accessToken) return c.json({ error: 'No token' }, 401);
  try {
    const teamId = c.req.param('teamId');
    const categories = await kv.get(`team:${teamId}:categories`) || [];
    const allSquads: any[] = [];
    for (const cat of categories) {
      if (cat?.squads && Array.isArray(cat.squads)) {
        for (const sq of cat.squads) {
          if (sq?.active) allSquads.push({...sq, categoryName: sq.categoryName || cat.name});
        }
      }
    }
    return c.json({ squads: allSquads });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// Get specific squad with players
app.get('/make-server-0ea22bba/teams/:teamId/squads/:squadId', async (c) => {
  try {
    const teamId = c.req.param('teamId');
    const squadId = c.req.param('squadId');
    
    console.log(`📂 Buscando equipe ${squadId}`);
    
    const categories = await kv.get(`team:${teamId}:categories`) || [];
    
    let foundSquad = null;
    for (const category of categories) {
      const squad = category.squads?.find((s: any) => s.id === squadId);
      if (squad) {
        foundSquad = squad;
        break;
      }
    }
    
    if (!foundSquad) {
      return c.json({ error: 'Equipe não encontrada' }, 404);
    }
    
    return c.json({ squad: foundSquad });
  } catch (error: any) {
    console.error('❌ Erro ao buscar equipe:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete squad
app.delete('/make-server-0ea22bba/teams/:teamId/squads/:squadId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const teamId = c.req.param('teamId');
    const squadId = c.req.param('squadId');
    
    const user = await kv.get(`user:${userId}`);
    if (!user || user.id !== teamId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    const categories = await kv.get(`team:${teamId}:categories`) || [];
    
    let removed = false;
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      if (category.squads) {
        const squadIndex = category.squads.findIndex((s: any) => s.id === squadId);
        if (squadIndex !== -1) {
          category.squads.splice(squadIndex, 1);
          categories[i] = category;
          removed = true;
          break;
        }
      }
    }
    
    if (!removed) {
      return c.json({ error: 'Equipe não encontrada' }, 404);
    }
    
    await kv.set(`team:${teamId}:categories`, categories);
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('❌ Erro ao remover equipe:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Add player to squad
app.post('/make-server-0ea22bba/teams/:teamId/squads/:squadId/players', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const teamId = c.req.param('teamId');
    const squadId = c.req.param('squadId');
    const playerData = await c.req.json();
    
    const user = await kv.get(`user:${userId}`);
    if (!user || user.id !== teamId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    if (!playerData.name || !playerData.position || !playerData.number) {
      return c.json({ error: 'Nome, posição e número são obrigatórios' }, 400);
    }
    
    const categories = await kv.get(`team:${teamId}:categories`) || [];
    
    let foundCategory = null;
    let foundSquad = null;
    let categoryIndex = -1;
    let squadIndex = -1;
    
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      if (category.squads) {
        for (let j = 0; j < category.squads.length; j++) {
          if (category.squads[j].id === squadId) {
            foundCategory = category;
            foundSquad = category.squads[j];
            categoryIndex = i;
            squadIndex = j;
            break;
          }
        }
      }
      if (foundSquad) break;
    }
    
    if (!foundSquad) {
      return c.json({ error: 'Equipe não encontrada' }, 404);
    }
    
    const newPlayer = {
      id: playerData.id || `player:${Date.now()}`,
      name: playerData.name,
      position: playerData.position,
      number: parseInt(playerData.number),
      age: playerData.age ? parseInt(playerData.age) : undefined,
      height: playerData.height ? parseInt(playerData.height) : undefined,
      photoUrl: playerData.photoUrl || undefined,
      cpf: playerData.cpf || undefined,
      addedAt: new Date().toISOString()
    };
    
    if (!foundSquad.players) {
      foundSquad.players = [];
    }
    foundSquad.players.push(newPlayer);
    
    categories[categoryIndex].squads[squadIndex] = foundSquad;
    await kv.set(`team:${teamId}:categories`, categories);
    
    console.log(`✅ Jogador ${newPlayer.name} adicionado`);
    
    return c.json({ player: newPlayer });
  } catch (error: any) {
    console.error('❌ Erro ao adicionar jogador:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Remove player from squad
app.delete('/make-server-0ea22bba/teams/:teamId/squads/:squadId/players/:playerId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const teamId = c.req.param('teamId');
    const squadId = c.req.param('squadId');
    const playerId = c.req.param('playerId');
    
    const user = await kv.get(`user:${userId}`);
    if (!user || user.id !== teamId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    const categories = await kv.get(`team:${teamId}:categories`) || [];
    
    let removed = false;
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      if (category.squads) {
        for (let j = 0; j < category.squads.length; j++) {
          const squad = category.squads[j];
          if (squad.id === squadId && squad.players) {
            const playerIndex = squad.players.findIndex((p: any) => p.id === playerId);
            if (playerIndex !== -1) {
              squad.players.splice(playerIndex, 1);
              categories[i].squads[j] = squad;
              removed = true;
              break;
            }
          }
        }
      }
      if (removed) break;
    }
    
    if (!removed) {
      return c.json({ error: 'Jogador não encontrado' }, 404);
    }
    
    await kv.set(`team:${teamId}:categories`, categories);
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('❌ Erro ao remover jogador:', error);
    return c.json({ error: error.message }, 500);
  }
});
// ============= TOURNAMENT SQUAD REGISTRATION ROUTES =============

// Register squad in tournament
app.post('/make-server-0ea22bba/tournaments/:tournamentId/register-squad', async (c) => {
  console.log(`\n🏆 ====== POST /register-squad ======`);
  console.log(`   ⏰ Timestamp: ${new Date().toISOString()}`);
  
  try {
    console.log(`   🔍 Passo 1/7: Obtendo dados da requisição...`);
    const tournamentId = c.req.param('tournamentId');
    const body = await c.req.json();
    const { teamId, squadId } = body;
    
    // Obter userId do token ou usar teamId diretamente
    const authHeader = c.req.header('Authorization');
    let userId = teamId; // Fallback para teamId
    
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_ANON_KEY')!
        );
        const { data: { user } } = await supabase.auth.getUser(token);
        if (user) {
          userId = user.id;
        }
      } catch (error) {
        console.log('   ⚠️ Não foi possível validar token, usando teamId como userId');
      }
    }
    
    console.log(`   ✅ Dados recebidos:`);
    console.log(`      • userId:`, userId);
    console.log(`      • tournamentId:`, tournamentId);
    console.log(`      • teamId:`, teamId);
    console.log(`      • squadId:`, squadId);
    console.log(`      • squadId === null:`, squadId === null);
    console.log(`      • squadId === undefined:`, squadId === undefined);
    console.log(`      • !squadId:`, !squadId);
    console.log(`      • Tipo inscrição:`, !squadId ? '🏢 TIME COMPLETO' : '🏐 EQUIPE ESPECÍFICA');
    
    console.log(`\n   🔍 Passo 2/7: Verificando permissões...`);
    console.log(`      • Buscando usuário logado: user:${userId}`);
    const user = await kv.get(`user:${userId}`);
    console.log(`      • Usuário encontrado:`, !!user);
    
    console.log(`      • Buscando time: user:${teamId}`);
    const team = await kv.get(`user:${teamId}`);
    console.log(`      • Time encontrado:`, !!team);
    console.log(`      • Time type:`, team?.userType);
    
    // VERIFICAÇÃO CORRIGIDA: Ou o usuário É o time, OU o time existe e é válido
    const isValidRequest = (user?.id === teamId) || (team && team.userType === 'team');
    
    console.log(`      • User é o time:`, user?.id === teamId);
    console.log(`      • Team existe e é tipo team:`, team && team.userType === 'team');
    console.log(`      • ✅ Request válido:`, isValidRequest);
    
    // Validar se o time existe e é válido
    if (!team || team.userType !== 'team') {
      console.error(`   ❌ ERRO: Time não encontrado ou inválido`);
      console.error(`      • team exists:`, !!team);
      console.error(`      • team.userType:`, team?.userType);
      return c.json({ error: 'Time não encontrado ou inválido' }, 404);
    }
    
    // Usar dados do time
    const teamData = team;
    console.log(`   ✅ Time válido: ${teamData.name}`);
    
    console.log(`\n   🔍 Passo 3/7: Buscando torneio...`);
    
    const fullTournamentId = tournamentId.startsWith('tournament:') ? tournamentId : `tournament:${tournamentId}`;
    console.log(`      • fullTournamentId:`, fullTournamentId);
    
    const tournament = await kv.get(fullTournamentId);
    console.log(`      • Torneio encontrado:`, !!tournament);
    
    if (!tournament) {
      console.error(`   ❌ ERRO: Torneio não encontrado no KV`);
      return c.json({ error: 'Torneio não encontrado' }, 404);
    }
    console.log(`   ✅ Torneio encontrado: ${tournament.name}`);
    
    console.log(`\n   🔍 Passo 4/7: Inicializando arrays de inscrição...`);
    // Inicializar registrations se não existir
    if (!tournament.squadRegistrations) {
      tournament.squadRegistrations = [];
      console.log(`      • Array squadRegistrations criado`);
    } else {
      console.log(`      • Array squadRegistrations já existe (${tournament.squadRegistrations.length} itens)`);
    }
    
    let registration;
    
    console.log(`\n   🔍 Passo 5/7: Processando inscrição...`);
    // CASO 1: TIME SIMPLES (squadId = null) - Inscrição completa
    if (!squadId || squadId === null) {
      console.log(`\n   📋 ====== INSCRIÇÃO TIME COMPLETO ======`);
      console.log(`      • Nome do time: ${teamData.name}`);
      console.log(`      • Total de registrations ANTES: ${tournament.squadRegistrations?.length || 0}`);
      
      // Verificar se time já está inscrito (sem squad específico)
      const alreadyRegistered = tournament.squadRegistrations.find(
        (reg: any) => reg.teamId === teamId && (!reg.squadId || reg.squadId === null)
      );
      
      console.log(`   • Já inscrito:`, !!alreadyRegistered);
      if (alreadyRegistered) {
        console.log(`   ❌ Time já está inscrito!`);
        console.log(`      Registration:`, alreadyRegistered);
        return c.json({ error: 'Este time já está inscrito' }, 400);
      }
      console.log(`   ✅ Pode inscrever!`);
      
      // Criar registro de time completo
      registration = {
        id: `registration:${Date.now()}`,
        tournamentId: fullTournamentId,
        teamId,
        teamName: teamData.name,
        squadId: null,
        squadName: 'Equipe Principal', // Times simples = Equipe Principal
        categoryName: null,
        players: [],
        city: teamData.city || null,
        state: teamData.state || null,
        photoUrl: teamData.photoUrl || null,
        registeredAt: new Date().toISOString(),
        isFullTeam: true // Flag para identificar time completo
      };
      
      console.log(`✅ Time completo "${user.name}" inscrito com sucesso`);
      
    } 
    // CASO 2: TIME COM CATEGORIAS (squadId != null) - Inscrição de equipe específica
    else {
      console.log(`📋 Buscando equipe específica: ${squadId}`);
      
      // Buscar dados da equipe
      const categories = await kv.get(`team:${teamId}:categories`) || [];
      let foundSquad = null;
      for (const category of categories) {
        if (category.squads) {
          const squad = category.squads.find((s: any) => s.id === squadId);
          if (squad) {
            foundSquad = squad;
            break;
          }
        }
      }
      
      if (!foundSquad) {
        return c.json({ error: 'Equipe não encontrada' }, 404);
      }
      
      // Verificar se já está inscrita
      const alreadyRegistered = tournament.squadRegistrations.find(
        (reg: any) => reg.teamId === teamId && reg.squadId === squadId
      );
      if (alreadyRegistered) {
        return c.json({ error: 'Esta equipe já está inscrita' }, 400);
      }
      
      // Criar registro de equipe específica
      registration = {
        id: `registration:${Date.now()}`,
        tournamentId: fullTournamentId,
        teamId,
        teamName: teamData.name,
        squadId,
        squadName: foundSquad.name,
        categoryName: foundSquad.categoryName,
        players: foundSquad.players || [],
        city: teamData.city || null,
        state: teamData.state || null,
        photoUrl: teamData.photoUrl || null,
        registeredAt: new Date().toISOString(),
        isFullTeam: false
      };
      
      console.log(`✅ Equipe "${foundSquad.name}" inscrita com sucesso`);
    }
    
    tournament.squadRegistrations.push(registration);
    
    // Também adicionar ao array legado registeredTeams (compatibilidade)
    if (!tournament.registeredTeams) {
      tournament.registeredTeams = [];
    }
    if (!tournament.registeredTeams.includes(teamId)) {
      tournament.registeredTeams.push(teamId);
    }
    
    await kv.set(fullTournamentId, tournament);
    
    return c.json({ registration });
  } catch (error: any) {
    console.error('❌ Erro ao inscrever equipe:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get team registrations in tournament
app.get('/make-server-0ea22bba/tournaments/:tournamentId/registrations/:teamId', authMiddleware, async (c) => {
  try {
    const tournamentId = c.req.param('tournamentId');
    const teamId = c.req.param('teamId');
    
    const fullTournamentId = tournamentId.startsWith('tournament:') ? tournamentId : `tournament:${tournamentId}`;
    const tournament = await kv.get(fullTournamentId);
    
    if (!tournament) {
      return c.json({ error: 'Torneio não encontrado' }, 404);
    }
    
    const registrations = tournament.squadRegistrations?.filter(
      (reg: any) => reg.teamId === teamId
    ) || [];
    
    return c.json({ registrations });
  } catch (error: any) {
    console.error('❌ Erro ao buscar inscrições:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Unregister team/squad from tournament (DELETE)
app.delete('/make-server-0ea22bba/tournaments/:tournamentId/register', authMiddleware, async (c) => {
  console.log(`\n🗑️ ====== DELETE /register (Cancelar Inscrição) ======`);
  
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const { teamId } = await c.req.json();
    
    console.log(`   • userId: ${userId}`);
    console.log(`   • teamId: ${teamId}`);
    console.log(`   • tournamentId: ${tournamentId}`);
    
    const fullTournamentId = tournamentId.startsWith('tournament:') ? tournamentId : `tournament:${tournamentId}`;
    const tournament = await kv.get(fullTournamentId);
    
    if (!tournament) {
      return c.json({ error: 'Torneio não encontrado' }, 404);
    }
    
    console.log(`   • Total de inscrições ANTES: ${tournament.squadRegistrations?.length || 0}`);
    
    // Remover TODAS as inscrições deste time (incluindo time completo e equipes específicas)
    const initialLength = tournament.squadRegistrations?.length || 0;
    tournament.squadRegistrations = tournament.squadRegistrations?.filter(
      (reg: any) => reg.teamId !== teamId
    ) || [];
    
    const removedCount = initialLength - tournament.squadRegistrations.length;
    console.log(`   • Inscrições removidas: ${removedCount}`);
    console.log(`   • Total de inscrições DEPOIS: ${tournament.squadRegistrations.length}`);
    
    // Também remover do array legado registeredTeams
    if (tournament.registeredTeams) {
      tournament.registeredTeams = tournament.registeredTeams.filter(
        (id: string) => id !== teamId
      );
    }
    
    await kv.set(fullTournamentId, tournament);
    
    console.log(`✅ Inscrição(ões) cancelada(s) com sucesso`);
    
    return c.json({ success: true, removedCount });
  } catch (error: any) {
    console.error('❌ Erro ao cancelar inscrição:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get team registrations in tournament
app.get('/make-server-0ea22bba/tournaments/:tournamentId/registrations/:teamId', authMiddleware, async (c) => {
  console.log(`\n🔍 ====== GET /registrations/:teamId ======`);
  
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const teamId = c.req.param('teamId');
    
    console.log(`   • userId: ${userId}`);
    console.log(`   • tournamentId: ${tournamentId}`);
    console.log(`   • teamId: ${teamId}`);
    
    const fullTournamentId = tournamentId.startsWith('tournament:') ? tournamentId : `tournament:${tournamentId}`;
    const tournament = await kv.get(fullTournamentId);
    
    if (!tournament) {
      console.log(`   ❌ Torneio não encontrado`);
      return c.json({ registrations: [] });
    }
    
    // Buscar todas as inscrições deste time
    const teamRegistrations = tournament.squadRegistrations?.filter(
      (reg: any) => reg.teamId === teamId
    ) || [];
    
    console.log(`   ✅ Encontradas ${teamRegistrations.length} inscrição(ões)`);
    teamRegistrations.forEach((reg: any, index: number) => {
      console.log(`      ${index + 1}. ${reg.squadName || 'TIME COMPLETO'} (squadId: ${reg.squadId || 'null'})`);
    });
    
    return c.json({ registrations: teamRegistrations });
  } catch (error: any) {
    console.error('❌ Erro ao buscar inscrições:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Validate squad players (check for duplicates)
app.post('/make-server-0ea22bba/tournaments/:tournamentId/validate-players', authMiddleware, async (c) => {
  try {
    const tournamentId = c.req.param('tournamentId');
    const { teamId, squadId, playerIds } = await c.req.json();
    
    const fullTournamentId = tournamentId.startsWith('tournament:') ? tournamentId : `tournament:${tournamentId}`;
    const tournament = await kv.get(fullTournamentId);
    
    if (!tournament) {
      return c.json({ error: 'Torneio não encontrado' }, 404);
    }
    
    // Buscar todos os jogadores já inscritos deste time
    const existingRegistrations = tournament.squadRegistrations?.filter(
      (reg: any) => reg.teamId === teamId
    ) || [];
    
    const registeredPlayerIds = new Set<string>();
    const conflicts: any[] = [];
    
    // Coletar IDs de todos os jogadores já registrados
    for (const reg of existingRegistrations) {
      if (reg.players) {
        for (const player of reg.players) {
          registeredPlayerIds.add(player.id);
        }
      }
    }
    
    // Verificar se algum jogador da nova equipe já está registrado
    for (const playerId of playerIds) {
      if (registeredPlayerIds.has(playerId)) {
        // Encontrar em qual equipe está
        for (const reg of existingRegistrations) {
          const player = reg.players?.find((p: any) => p.id === playerId);
          if (player) {
            conflicts.push({
              playerId: player.id,
              playerName: player.name,
              existingSquad: reg.squadName
            });
            break;
          }
        }
      }
    }
    
    const valid = conflicts.length === 0;
    
    return c.json({ valid, conflicts });
  } catch (error: any) {
    console.error('❌ Erro ao validar jogadores:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Unregister squad from tournament
app.delete('/make-server-0ea22bba/tournaments/:tournamentId/register-squad', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const { teamId, squadId } = await c.req.json();
    
    const user = await kv.get(`user:${userId}`);
    if (!user || user.id !== teamId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    const fullTournamentId = tournamentId.startsWith('tournament:') ? tournamentId : `tournament:${tournamentId}`;
    const tournament = await kv.get(fullTournamentId);
    
    if (!tournament) {
      return c.json({ error: 'Torneio não encontrado' }, 404);
    }
    
    if (!tournament.squadRegistrations) {
      return c.json({ error: 'Nenhuma inscrição encontrada' }, 404);
    }
    
    console.log(`🗑️ Removendo inscrição:`, { teamId, squadId: squadId || 'TIME COMPLETO' });
    console.log(`📋 Total de inscrições antes: ${tournament.squadRegistrations.length}`);
    
    const initialLength = tournament.squadRegistrations.length;
    
    // IMPORTANTE: Comparar null/undefined corretamente
    tournament.squadRegistrations = tournament.squadRegistrations.filter(
      (reg: any) => {
        // Se os teamIds são diferentes, manter
        if (reg.teamId !== teamId) return true;
        
        // Se ambos são null/undefined, remover (time completo)
        if ((reg.squadId === null || reg.squadId === undefined) && 
            (squadId === null || squadId === undefined)) {
          console.log(`   🗑️ Removendo time completo: ${reg.teamName}`);
          return false;
        }
        
        // Se squadIds são iguais, remover (equipe específica)
        if (reg.squadId === squadId) {
          console.log(`   🗑️ Removendo equipe: ${reg.squadName} (${reg.categoryName})`);
          return false;
        }
        
        // Caso contrário, manter
        return true;
      }
    );
    
    console.log(`📋 Total de inscrições depois: ${tournament.squadRegistrations.length}`);
    
    if (tournament.squadRegistrations.length === initialLength) {
      console.log(`⚠️ Nenhuma inscrição foi removida!`);
      return c.json({ error: 'Inscrição não encontrada' }, 404);
    }
    
    // Atualizar registeredTeams também (compatibilidade)
    if (tournament.registeredTeams) {
      const hasOtherRegistrations = tournament.squadRegistrations.some((r: any) => r.teamId === teamId);
      if (!hasOtherRegistrations) {
        tournament.registeredTeams = tournament.registeredTeams.filter((id: string) => id !== teamId);
        console.log(`   🗑️ Removido de registeredTeams também`);
      }
    }
    
    await kv.set(fullTournamentId, tournament);
    
    console.log(`✅ Inscrição removida com sucesso do torneio`);
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('❌ Erro ao remover inscrição:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= TEAM CATEGORIES & SQUADS ROUTES =============

// Get all categories and squads for a team
app.get('/make-server-0ea22bba/teams/:teamId/categories', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const teamId = c.req.param('teamId');
    
    // Verificar autorização
    if (userId !== teamId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    const categoriesData = await kv.get(`team:${teamId}:categories`) || [];
    
    console.log(`✅ Categories loaded for team ${teamId}:`, categoriesData.length);
    
    return c.json({ categories: categoriesData });
  } catch (error: any) {
    console.error('❌ Error getting categories:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Create new category (Feminino/Masculino)
app.post('/make-server-0ea22bba/teams/:teamId/categories', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const teamId = c.req.param('teamId');
    const { categoryName } = await c.req.json();
    
    if (userId !== teamId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    if (!categoryName || !['Feminino', 'Masculino'].includes(categoryName)) {
      return c.json({ error: 'Invalid category name' }, 400);
    }
    
    // Buscar categorias existentes
    let categories = await kv.get(`team:${teamId}:categories`) || [];
    
    // Verificar se já existe
    const exists = categories.find((c: any) => c.name === categoryName);
    if (exists) {
      return c.json({ error: 'Category already exists' }, 400);
    }
    
    // Criar nova categoria
    const categoryId = `category:${teamId}:${categoryName.toLowerCase()}`;
    const newCategory = {
      id: categoryId,
      name: categoryName,
      squads: [],
      createdAt: new Date().toISOString()
    };
    
    categories.push(newCategory);
    await kv.set(`team:${teamId}:categories`, categories);
    
    console.log(`✅ Category created: ${categoryName}`);
    
    return c.json({ category: newCategory, categories });
  } catch (error: any) {
    console.error('❌ Error creating category:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Create new squad within a category
app.post('/make-server-0ea22bba/teams/:teamId/categories/:categoryId/squads', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const teamId = c.req.param('teamId');
    const categoryId = c.req.param('categoryId');
    const { squadName } = await c.req.json();
    
    if (userId !== teamId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    if (!squadName?.trim()) {
      return c.json({ error: 'Squad name is required' }, 400);
    }
    
    let categories = await kv.get(`team:${teamId}:categories`) || [];
    const category = categories.find((c: any) => c.id === categoryId);
    
    if (!category) {
      return c.json({ error: 'Category not found' }, 404);
    }
    
    // Criar nova equipe
    const timestamp = Date.now();
    const squadId = `squad:${categoryId}:${squadName.replace(/\s+/g, '-').toLowerCase()}:${timestamp}`;
    const newSquad = {
      id: squadId,
      name: squadName,
      categoryId: category.id,
      categoryName: category.name,
      players: [],
      createdAt: new Date().toISOString(),
      active: true
    };
    
    // Adicionar à categoria
    category.squads = category.squads || [];
    category.squads.push(newSquad);
    
    await kv.set(`team:${teamId}:categories`, categories);
    
    console.log(`✅ Squad created: ${squadName} in ${category.name}`);
    
    return c.json({ squad: newSquad, categories });
  } catch (error: any) {
    console.error('❌ Error creating squad:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get specific squad with players
app.get('/make-server-0ea22bba/teams/:teamId/squads/:squadId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const teamId = c.req.param('teamId');
    const squadId = c.req.param('squadId');
    
    if (userId !== teamId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    const categories = await kv.get(`team:${teamId}:categories`) || [];
    
    let foundSquad = null;
    for (const category of categories) {
      const squad = category.squads?.find((s: any) => s.id === squadId);
      if (squad) {
        foundSquad = squad;
        break;
      }
    }
    
    if (!foundSquad) {
      return c.json({ error: 'Squad not found' }, 404);
    }
    
    return c.json({ squad: foundSquad });
  } catch (error: any) {
    console.error('❌ Error getting squad:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Delete squad
app.delete('/make-server-0ea22bba/teams/:teamId/squads/:squadId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const teamId = c.req.param('teamId');
    const squadId = c.req.param('squadId');
    
    if (userId !== teamId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    let categories = await kv.get(`team:${teamId}:categories`) || [];
    let squadDeleted = false;
    
    for (const category of categories) {
      const initialLength = category.squads?.length || 0;
      category.squads = category.squads?.filter((s: any) => s.id !== squadId) || [];
      
      if (category.squads.length < initialLength) {
        squadDeleted = true;
      }
    }
    
    if (!squadDeleted) {
      return c.json({ error: 'Squad not found' }, 404);
    }
    
    await kv.set(`team:${teamId}:categories`, categories);
    
    console.log(`✅ Squad deleted: ${squadId}`);
    
    return c.json({ success: true, categories });
  } catch (error: any) {
    console.error('❌ Error deleting squad:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Add player to squad
app.post('/make-server-0ea22bba/teams/:teamId/squads/:squadId/players', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const teamId = c.req.param('teamId');
    const squadId = c.req.param('squadId');
    const playerData = await c.req.json();
    
    if (userId !== teamId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    if (!playerData.name || !playerData.position || !playerData.number) {
      return c.json({ error: 'Missing required player fields' }, 400);
    }
    
    let categories = await kv.get(`team:${teamId}:categories`) || [];
    let squadFound = false;
    
    for (const category of categories) {
      const squad = category.squads?.find((s: any) => s.id === squadId);
      if (squad) {
        squadFound = true;
        
        // Criar novo jogador
        const playerId = `player:${squadId}:${Date.now()}`;
        const newPlayer = {
          id: playerId,
          name: playerData.name,
          position: playerData.position,
          number: playerData.number,
          age: playerData.age,
          height: playerData.height,
          photoUrl: playerData.photoUrl,
          cpf: playerData.cpf,
          addedAt: new Date().toISOString()
        };
        
        squad.players = squad.players || [];
        squad.players.push(newPlayer);
        
        break;
      }
    }
    
    if (!squadFound) {
      return c.json({ error: 'Squad not found' }, 404);
    }
    
    await kv.set(`team:${teamId}:categories`, categories);
    
    console.log(`✅ Player added to squad ${squadId}: ${playerData.name}`);
    
    return c.json({ success: true, categories });
  } catch (error: any) {
    console.error('❌ Error adding player:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Remove player from squad
app.delete('/make-server-0ea22bba/teams/:teamId/squads/:squadId/players/:playerId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const teamId = c.req.param('teamId');
    const squadId = c.req.param('squadId');
    const playerId = c.req.param('playerId');
    
    if (userId !== teamId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    let categories = await kv.get(`team:${teamId}:categories`) || [];
    let playerRemoved = false;
    
    for (const category of categories) {
      const squad = category.squads?.find((s: any) => s.id === squadId);
      if (squad) {
        const initialLength = squad.players?.length || 0;
        squad.players = squad.players?.filter((p: any) => p.id !== playerId) || [];
        
        if (squad.players.length < initialLength) {
          playerRemoved = true;
        }
        
        break;
      }
    }
    
    if (!playerRemoved) {
      return c.json({ error: 'Player not found' }, 404);
    }
    
    await kv.set(`team:${teamId}:categories`, categories);
    
    console.log(`✅ Player removed from squad ${squadId}: ${playerId}`);
    
    return c.json({ success: true, categories });
  } catch (error: any) {
    console.error('❌ Error removing player:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ❌ ROTA DUPLICADA COMENTADA - A versão correta está ANTES de /:squadId (linha ~3545)
// Get squads available for tournament registration
/*app.get('/make-server-0ea22bba/teams/:teamId/squads/available', async (c) => {
  console.log(`\n🔍 ====== INICIO GET /squads/available ======`);
  
  // Auth check manual (melhor que middleware para debug)
  const authHeader = c.req.header('Authorization');
  const accessToken = authHeader?.split(' ')[1];
  
  console.log(`   • Authorization header presente: ${!!authHeader}`);
  console.log(`   • Access token extraído: ${accessToken ? 'SIM' : 'NÃO'}`);
  console.log(`   • Token length: ${accessToken?.length || 0}`);
  console.log(`   • É ANON_KEY: ${accessToken === Deno.env.get('SUPABASE_ANON_KEY')}`);
  
  // ✅ ACEITAR TOKEN DE USUÁRIO OU ANON_KEY (público)
  if (!accessToken) {
    console.error('❌ No access token provided');
    return c.json({ error: 'Unauthorized - No token' }, 401);
  }
  
  let userId: string | null = null;
  const isAnonKey = accessToken === Deno.env.get('SUPABASE_ANON_KEY');
  
  // Se NÃO for ANON_KEY, tentar autenticar usuário
  if (!isAnonKey) {
    try {
      const supabaseClient = await initializeSupabase();
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser(accessToken);
      
      if (authError || !user) {
        console.error('❌ Auth failed:', authError?.message);
        // Tentar continuar sem userId (permite acesso público)
        console.log('⚠️ Continuando sem userId (acesso público)');
      } else {
        userId = user.id;
        console.log(`✅ Usuário autenticado: ${userId}`);
      }
    } catch (authError: any) {
      console.error('❌ Auth error:', authError);
      // Não retornar erro - permite acesso público
      console.log('⚠️ Continuando sem userId (erro na auth)');
    }
  } else {
    console.log('ℹ️ ANON_KEY detectado - acesso público permitido');
  }
  
  try {
    const teamId = c.req.param('teamId');
    const type = c.req.query('type'); // 'indoor' or 'beach'
    
    console.log(`   • Usuário logado (userId): ${userId}`);
    console.log(`   • Time requisitado (teamId): ${teamId}`);
    console.log(`   • Tipo de modalidade: ${type || 'não especificado'}`);
    console.log(`   • Buscando chave KV: team:${teamId}:categories`);
    
    // Buscar categorias do time com proteção
    let categories: any[] = [];
    try {
      console.log(`   • Chamando kv.get...`);
      const kvResult = await kv.get(`team:${teamId}:categories`);
      console.log(`   • kv.get retornou:`, kvResult);
      categories = kvResult || [];
      console.log(`   • Categorias array: ${Array.isArray(categories)}`);
    } catch (kvError: any) {
      console.error(`   ❌ Erro no kv.get:`, kvError.message);
      categories = [];
    }
    
    console.log(`\n📦 Categorias no KV:`, JSON.stringify(categories, null, 2));
    console.log(`🔢 Total de categorias encontradas: ${categories.length}`);
    
    if (!Array.isArray(categories)) {
      console.error(`❌ ERRO: categories não é array!`, typeof categories);
      return c.json({ squads: [] });
    }
    
    // Flatten all squads from all categories
    const allSquads: any[] = [];
    for (const category of categories) {
      if (!category) {
        console.warn(`⚠️ Categoria nula encontrada, pulando...`);
        continue;
      }
      
      console.log(`\n   📁 Categoria "${category.name}"`);
      console.log(`      • ID: ${category.id}`);
      console.log(`      • Squads property: ${category.squads ? 'existe' : 'NÃO EXISTE'}`);
      console.log(`      • Tipo squads: ${typeof category.squads}`);
      console.log(`      • É array: ${Array.isArray(category.squads)}`);
      
      if (category.squads && Array.isArray(category.squads)) {
        console.log(`      • Total de equipes: ${category.squads.length}`);
        
        for (const squad of category.squads) {
          if (!squad) {
            console.warn(`      ⚠️ Squad nulo encontrado, pulando...`);
            continue;
          }
          
          console.log(`\n         🏐 Equipe: ${squad.name}`);
          console.log(`            • ID: ${squad.id}`);
          console.log(`            • Ativa: ${squad.active}`);
          console.log(`            • Jogadores: ${squad.players?.length || 0}`);
          console.log(`            • Categoria: ${squad.categoryName || category.name}`);
          
          if (squad.active) {
            // Garantir que a equipe tenha categoryName
            const squadWithCategory = {
              ...squad,
              categoryName: squad.categoryName || category.name
            };
            allSquads.push(squadWithCategory);
            console.log(`            ✅ ADICIONADA à lista de disponíveis`);
          } else {
            console.log(`            ⚠️ INATIVA - NÃO adicionada`);
          }
        }
      } else if (category.squads) {
        console.log(`      ❌ ERRO: squads existe mas não é array!`);
        console.log(`         Valor: ${JSON.stringify(category.squads)}`);
      } else {
        console.log(`      ℹ️  Categoria sem equipes (squads não definido)`);
      }
    }
    
    console.log(`\n✅ ====== RESULTADO ======`);
    console.log(`   Total de equipes ATIVAS disponíveis: ${allSquads.length}`);
    if (allSquads.length > 0) {
      allSquads.forEach((s, i) => {
        console.log(`   ${i + 1}. ${s.name} (${s.categoryName}) - ${s.players?.length || 0} jogadores`);
      });
    }
    console.log(`====== FIM ======\n`);
    
    return c.json({ squads: allSquads });
  } catch (error: any) {
    console.error(`\n❌ ====== ERRO FATAL ======`);
    console.error(`   Erro:`, error);
    console.error(`   Mensagem:`, error.message);
    console.error(`   Stack:`, error.stack);
    console.error(`====== FIM ERRO ======\n`);
    return c.json({ error: error.message || 'Erro ao buscar equipes' }, 500);
  }
});*/

// ============= TOURNAMENTS ROUTES =============

// 🔍 DEBUG: Log ALL incoming requests
app.use('/make-server-0ea22bba/tournaments/*', async (c, next) => {
  console.log('📥 Incoming tournament request:', {
    method: c.req.method,
    path: c.req.path,
    url: c.req.url,
    hasBody: c.req.header('content-length') !== '0',
    contentType: c.req.header('content-type')
  });
  await next();
});

// Create tournament
app.post('/make-server-0ea22bba/tournaments', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    
    // 🔍 DEBUG: Log before parsing JSON
    const contentLength = c.req.header('content-length');
    console.log('📝 Creating tournament - Content-Length:', contentLength);
    
    if (!contentLength || contentLength === '0') {
      console.error('❌ No body provided for tournament creation');
      return c.json({ error: 'Request body is required' }, 400);
    }
    
    const { name, location, arena, startDate, endDate, maxTeams, format, modalityType } = await c.req.json();
    
    if (!name || !location || !startDate || !endDate) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Para vôlei de praia, arena é obrigatória
    if (modalityType === 'beach' && !arena) {
      return c.json({ error: 'Arena is required for beach volleyball tournaments' }, 400);
    }
    
    // Get organizer info
    const organizer = await kv.get(`user:${userId}`);
    if (!organizer) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    const tournamentId = `tournament:${Date.now()}:${userId}`;
    const tournament = {
      id: tournamentId,
      name,
      location,
      arena: modalityType === 'beach' ? arena : undefined,
      startDate,
      endDate,
      maxTeams: maxTeams || 16,
      format: format || 'single_elimination',
      modalityType: modalityType || 'indoor',
      organizerId: userId,
      organizerName: organizer.name,
      status: 'upcoming',
      registeredTeams: modalityType === 'indoor' ? [] : undefined,
      registeredPlayers: modalityType === 'beach' ? [] : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(tournamentId, tournament);
    console.log(`🏆 Torneio criado: ${name} (${modalityType})${arena ? ` na arena: ${arena}` : ''}`);
    
    return c.json({ tournament });
  } catch (error: any) {
    console.error('❌ Error creating tournament:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get all tournaments (DUPLICADO - JÁ EXISTE ACIMA)
// ESTA ROTA NUNCA É CHAMADA PORQUE A PRIMEIRA (linha ~1733) TEM PRECEDÊNCIA

// Get tournament details
app.get('/make-server-0ea22bba/tournaments/:tournamentId', async (c) => {
  try {
    const tournamentId = c.req.param('tournamentId');
    const fullTournamentId = tournamentId.startsWith('tournament:') ? tournamentId : `tournament:${tournamentId}`;
    
    const tournament = await kv.get(fullTournamentId);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    return c.json({ tournament });
  } catch (error: any) {
    console.error('❌ Error getting tournament:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= BEACH TOURNAMENT TEAM REGISTRATION =============

// 🆕 INDIVIDUAL REGISTRATION - Atleta se inscreve para participar do torneio
app.post('/make-server-0ea22bba/tournaments/:tournamentId/register-individual', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const fullTournamentId = tournamentId.startsWith('tournament:') ? tournamentId : `tournament:${tournamentId}`;
    
    console.log('🏖️ Individual registration REQUEST:', { 
      tournamentId, 
      fullTournamentId,
      userId,
      method: c.req.method,
      path: c.req.path
    });
    
    const tournament = await kv.get(fullTournamentId);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    if (tournament.modalityType !== 'beach') {
      return c.json({ error: 'This endpoint is only for beach tournaments' }, 400);
    }
    
    // Initialize arrays if needed
    if (!tournament.individualRegistrations) {
      tournament.individualRegistrations = [];
    }
    
    // Check if already registered
    const alreadyRegistered = tournament.individualRegistrations.some((reg: any) => reg.userId === userId);
    if (alreadyRegistered) {
      return c.json({ error: 'You are already registered for this tournament' }, 400);
    }
    
    // Get user profile
    const userKey = `user:${userId}`;
    const userProfile = await kv.get(userKey);
    
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }
    
    // Add individual registration
    const registration = {
      userId,
      name: userProfile.name,
      avatar: userProfile.avatar,
      position: userProfile.position || 'Atleta',
      registeredAt: new Date().toISOString(),
      hasTeam: false, // Ainda não formou equipe
    };
    
    tournament.individualRegistrations.push(registration);
    tournament.updatedAt = new Date().toISOString();
    
    await kv.set(fullTournamentId, tournament);
    console.log(`✅ Atleta inscrito individualmente: ${userProfile.name} no torneio ${tournament.name}`);
    
    return c.json({ 
      success: true, 
      registration,
      message: 'Successfully registered for the tournament'
    });
  } catch (error: any) {
    console.error('❌ Error in individual registration:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 🆕 GET REGISTERED PLAYERS - Lista atletas inscritos no torneio
app.get('/make-server-0ea22bba/tournaments/:tournamentId/registered-players', authMiddleware, async (c) => {
  try {
    const tournamentId = c.req.param('tournamentId');
    const fullTournamentId = tournamentId.startsWith('tournament:') ? tournamentId : `tournament:${tournamentId}`;
    
    console.log('📋 Getting registered players:', tournamentId);
    
    const tournament = await kv.get(fullTournamentId);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    const registrations = tournament.individualRegistrations || [];
    
    // Filtrar apenas os que ainda não formaram equipe
    const availablePlayers = registrations.filter((reg: any) => !reg.hasTeam);
    
    console.log(`✅ ${availablePlayers.length} jogadores disponíveis de ${registrations.length} inscritos`);
    
    return c.json({ 
      players: availablePlayers,
      total: registrations.length,
      available: availablePlayers.length
    });
  } catch (error: any) {
    console.error('❌ Error getting registered players:', error);
    return c.json({ error: error.message }, 500);
  }
});

// 🆕 CHECK IF USER IS REGISTERED - Verifica se o usuário já se inscreveu
app.get('/make-server-0ea22bba/tournaments/:tournamentId/check-registration', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const fullTournamentId = tournamentId.startsWith('tournament:') ? tournamentId : `tournament:${tournamentId}`;
    
    const tournament = await kv.get(fullTournamentId);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    const registrations = tournament.individualRegistrations || [];
    const registration = registrations.find((reg: any) => reg.userId === userId);
    
    return c.json({ 
      isRegistered: !!registration,
      registration: registration || null
    });
  } catch (error: any) {
    console.error('❌ Error checking registration:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Register beach team (dupla/trio/quartet/quintet)
app.post('/make-server-0ea22bba/tournaments/:tournamentId/register-beach-team', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const fullTournamentId = tournamentId.startsWith('tournament:') ? tournamentId : `tournament:${tournamentId}`;
    const { teamName, players, teamSize, captainId } = await c.req.json();
    
    console.log('🏖️ Registering beach team:', { tournamentId, teamName, playerCount: players.length, teamSize });
    
    // Validações
    if (!teamName || !players || players.length === 0) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const tournament = await kv.get(fullTournamentId);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    if (tournament.modalityType !== 'beach') {
      return c.json({ error: 'This endpoint is only for beach tournaments' }, 400);
    }
    
    // Verificar número de jogadores
    const requiredPlayers = teamSize === 'duo' ? 2 : teamSize === 'trio' ? 3 : teamSize === 'quartet' ? 4 : 5;
    if (players.length !== requiredPlayers) {
      return c.json({ 
        error: `Team must have exactly ${requiredPlayers} players for ${teamSize} format` 
      }, 400);
    }
    
    // Initialize arrays if needed
    if (!tournament.registeredTeams) {
      tournament.registeredTeams = [];
    }
    if (!tournament.individualRegistrations) {
      tournament.individualRegistrations = [];
    }
    
    // 🆕 Verificar se todos os jogadores estão inscritos individualmente
    for (const player of players) {
      const isRegistered = tournament.individualRegistrations.some((reg: any) => reg.userId === player.id);
      if (!isRegistered) {
        return c.json({ 
          error: `Player ${player.name} is not registered for this tournament. They need to register individually first.` 
        }, 400);
      }
    }
    
    // Check if any player is already registered in another team
    for (const player of players) {
      const alreadyRegistered = tournament.registeredTeams.some((team: any) =>
        team.players.some((p: any) => p.id === player.id)
      );
      if (alreadyRegistered) {
        return c.json({ 
          error: `Player ${player.name} is already registered in this tournament` 
        }, 400);
      }
    }
    
    // Check if tournament is full
    if (tournament.registeredTeams.length >= tournament.maxTeams) {
      return c.json({ error: 'Tournament is full' }, 400);
    }
    
    // Create team ID
    const teamId = `beach-team:${Date.now()}:${userId}`;
    
    // Create team object
    const newTeam = {
      id: teamId,
      name: teamName,
      players: players.map((p: any) => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        position: p.position,
      })),
      teamSize,
      captainId: captainId || userId,
      registeredAt: new Date().toISOString(),
    };
    
    // Add team to tournament
    tournament.registeredTeams.push(newTeam);
    
    // 🆕 Marcar jogadores como "hasTeam = true"
    for (const player of players) {
      const registration = tournament.individualRegistrations.find((reg: any) => reg.userId === player.id);
      if (registration) {
        registration.hasTeam = true;
        registration.teamId = teamId;
        registration.teamName = teamName;
      }
    }
    
    tournament.updatedAt = new Date().toISOString();
    
    await kv.set(fullTournamentId, tournament);
    console.log(`✅ Beach team ${teamName} registered successfully with ${players.length} players`);
    
    return c.json({ 
      success: true, 
      team: newTeam,
      message: 'Team registered successfully'
    });
  } catch (error: any) {
    console.error('❌ Error registering beach team:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Unregister beach team (dupla/trio/quartet/quintet)
app.delete('/make-server-0ea22bba/tournaments/:tournamentId/register-beach-team', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.param('tournamentId');
    const fullTournamentId = tournamentId.startsWith('tournament:') ? tournamentId : `tournament:${tournamentId}`;
    
    console.log('🗑️ Unregistering beach team:', { tournamentId, userId });
    
    const tournament = await kv.get(fullTournamentId);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    if (tournament.modalityType !== 'beach') {
      return c.json({ error: 'This endpoint is only for beach tournaments' }, 400);
    }
    
    if (tournament.status !== 'upcoming') {
      return c.json({ error: 'Cannot unregister from ongoing tournament' }, 400);
    }
    
    const registeredTeams = tournament.registeredTeams || [];
    
    // Find team that contains current user
    const teamIndex = registeredTeams.findIndex((team: any) => 
      team.players && team.players.some((p: any) => p.id === userId)
    );
    
    if (teamIndex === -1) {
      return c.json({ error: 'You are not registered in this tournament' }, 400);
    }
    
    const removedTeam = registeredTeams[teamIndex];
    
    // Remove team
    registeredTeams.splice(teamIndex, 1);
    tournament.registeredTeams = registeredTeams;
    
    // 🆕 Desmarcar jogadores (hasTeam = false)
    if (tournament.individualRegistrations) {
      for (const player of removedTeam.players) {
        const registration = tournament.individualRegistrations.find((reg: any) => reg.userId === player.id);
        if (registration) {
          registration.hasTeam = false;
          delete registration.teamId;
          delete registration.teamName;
        }
      }
    }
    
    tournament.updatedAt = new Date().toISOString();
    await kv.set(fullTournamentId, tournament);
    
    console.log(`✅ Beach team "${removedTeam.name}" unregistered successfully`);
    
    return c.json({ 
      success: true,
      message: 'Team unregistered successfully'
    });
  } catch (error: any) {
    console.error('❌ Error unregistering beach team:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= USER SEARCH ROUTES =============

// Debug endpoint - Check how many athletes exist (public, no auth required)
app.get('/make-server-0ea22bba/debug/athletes-count', async (c) => {
  try {
    const allUsers = await kv.getByPrefix('user:');
    const athletes = allUsers.filter((user: any) => user.userType === 'athlete');
    const teams = allUsers.filter((user: any) => user.userType === 'team');
    const fans = allUsers.filter((user: any) => user.userType === 'fan');
    
    const athletesList = athletes.map((a: any) => ({
      name: a.name,
      position: a.position,
      id: a.id
    }));
    
    return c.json({
      total_users: allUsers.length,
      athletes: athletes.length,
      teams: teams.length,
      fans: fans.length,
      athlete_list: athletesList
    });
  } catch (error: any) {
    console.error('❌ Error counting athletes:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Search users (for finding partners)
app.get('/make-server-0ea22bba/users/search', authMiddleware, async (c) => {
  try {
    const query = c.req.query('query');
    const type = c.req.query('type'); // 'athlete', 'team', 'fan', etc.
    
    if (!query || query.trim().length === 0) {
      return c.json({ error: 'Search query is required' }, 400);
    }
    
    console.log('🔍 Searching users:', { query, type });
    
    // Get all users
    const allUsers = await kv.getByPrefix('user:');
    console.log(`📊 Total users in database: ${allUsers.length}`);
    
    // Count athletes
    const athletes = allUsers.filter((user: any) => user.userType === 'athlete');
    console.log(`🏃 Total athletes in database: ${athletes.length}`);
    
    // Filter by name (case insensitive) and type
    const searchLower = query.toLowerCase();
    let filteredUsers = allUsers.filter((user: any) => 
      user.name && user.name.toLowerCase().includes(searchLower)
    );
    
    console.log(`🔍 Users matching name "${query}": ${filteredUsers.length}`);
    
    // Filter by type if specified
    if (type) {
      filteredUsers = filteredUsers.filter((user: any) => user.userType === type);
      console.log(`🎯 Users matching name AND type "${type}": ${filteredUsers.length}`);
    }
    
    // Remove sensitive data and limit results
    const results = filteredUsers.slice(0, 20).map((user: any) => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      position: user.position,
      userType: user.userType,
      currentTeam: user.currentTeam,
    }));
    
    console.log(`✅ Found ${results.length} users`);
    console.log(`📋 Results:`, results.map(u => `${u.name} (${u.userType})`));
    
    return c.json({ users: results });
  } catch (error: any) {
    console.error('❌ Error searching users:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Reset all tournaments (master only)
app.post('/make-server-0ea22bba/admin/reset-tournaments', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    
    // Check if user is master
    const isMaster = await isMasterUser(userId);
    if (!isMaster) {
      return c.json({ error: 'Master access required' }, 403);
    }
    
    // Delete all tournaments
    const allTournaments = await kv.getByPrefix('tournament:');
    for (const tournament of allTournaments) {
      await kv.del(tournament.id);
    }
    
    console.log(`🗑️ Todos os torneios foram deletados (${allTournaments.length} torneios)`);
    
    // Delete all matches
    const allMatches = await kv.getByPrefix('match:');
    for (const match of allMatches) {
      await kv.del(match.id);
    }
    console.log(`🗑️ Todas as partidas foram deletadas (${allMatches.length} partidas)`);
    
    // Delete all MVP votes
    const allVotes = await kv.getByPrefix('mvp:');
    for (const vote of allVotes) {
      // Se o voto tem id, usar ele; senão, construir a key
      const voteKey = vote.id || `mvp:${vote.tournamentId}:${vote.voterId}`;
      await kv.del(voteKey);
    }
    console.log(`🗑️ Todos os votos MVP foram deletados (${allVotes.length} votos)`);
    
    // Create default tournament
    const organizer = await kv.get(`user:${userId}`);
    const defaultTournamentId = `tournament:${Date.now()}:${userId}`;
    const defaultTournament = {
      id: defaultTournamentId,
      name: "Campeonato Municipal 2025",
      location: "Ginásio Municipal",
      startDate: "2025-11-15",
      endDate: "2025-11-30",
      maxTeams: 16,
      format: "single_elimination",
      modalityType: "indoor",
      organizerId: userId,
      organizerName: organizer?.name || 'Admin',
      status: 'upcoming',
      registeredTeams: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(defaultTournamentId, defaultTournament);
    console.log(`✅ Torneio padrão criado: ${defaultTournament.name}`);
    
    return c.json({ 
      success: true, 
      message: 'All tournaments reset',
      deletedCount: allTournaments.length,
      defaultTournament 
    });
  } catch (error: any) {
    console.error('❌ Error resetting tournaments:', error);
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

// ============= TOURNAMENT RESULTS & NOTIFICATIONS (REAL-TIME) =============

// Submit match result with automatic standings update and notifications
app.post('/make-server-0ea22bba/tournament/match/result', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const { tournamentId, matchId, category, division, result } = await c.req.json();
    
    console.log('📊 Registrando resultado:', { tournamentId, matchId, category, division });
    
    // Verify organizer permissions
    const tournamentKey = `tournament:${tournamentId}`;
    const tournament = await kv.get(tournamentKey);
    
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    if (tournament.organizerId !== userId) {
      return c.json({ error: 'Only organizer can submit results' }, 403);
    }
    
    // Save match result
    const matchKey = `match:${tournamentId}:${category}:${division}:${matchId}`;
    const match = await kv.get(matchKey) || {
      id: matchId,
      tournamentId,
      category,
      division
    };
    
    match.homeScore = result.homeScore;
    match.awayScore = result.awayScore;
    match.homeSets = result.homeSets;
    match.awaySets = result.awaySets;
    match.setScores = result.setScores;
    match.winnerId = result.winnerId;
    match.status = 'finished';
    match.finishedAt = new Date().toISOString();
    
    await kv.set(matchKey, match);
    
    // Calculate standings automatically
    await calculateStandings(tournamentId, category, division);
    
    // Notify participants
    const notificationCount = await notifyParticipants(tournamentId, category, division, match);
    
    console.log(`✅ Resultado registrado. ${notificationCount} participantes notificados.`);
    
    return c.json({ 
      success: true,
      match,
      notifications: notificationCount
    });
  } catch (error: any) {
    console.error('❌ Error submitting result:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Helper function to calculate standings
async function calculateStandings(tournamentId: string, category: string, division: string) {
  try {
    const matchesKey = `match:${tournamentId}:${category}:${division}:`;
    const allMatches = await kv.getByPrefix(matchesKey);
    const finishedMatches = allMatches.filter((m: any) => m.status === 'finished');
    
    // Calculate points: win = 3, loss = 0
    const standings: any = {};
    
    for (const match of finishedMatches) {
      const homeTeamId = match.homeTeamId;
      const awayTeamId = match.awayTeamId;
      
      if (!standings[homeTeamId]) {
        standings[homeTeamId] = {
          teamId: homeTeamId,
          played: 0,
          wins: 0,
          losses: 0,
          setsWon: 0,
          setsLost: 0,
          pointsWon: 0,
          pointsLost: 0,
          points: 0
        };
      }
      
      if (!standings[awayTeamId]) {
        standings[awayTeamId] = {
          teamId: awayTeamId,
          played: 0,
          wins: 0,
          losses: 0,
          setsWon: 0,
          setsLost: 0,
          pointsWon: 0,
          pointsLost: 0,
          points: 0
        };
      }
      
      standings[homeTeamId].played++;
      standings[awayTeamId].played++;
      
      standings[homeTeamId].setsWon += match.homeSets || 0;
      standings[homeTeamId].setsLost += match.awaySets || 0;
      standings[awayTeamId].setsWon += match.awaySets || 0;
      standings[awayTeamId].setsLost += match.homeSets || 0;
      
      standings[homeTeamId].pointsWon += match.homeScore || 0;
      standings[homeTeamId].pointsLost += match.awayScore || 0;
      standings[awayTeamId].pointsWon += match.awayScore || 0;
      standings[awayTeamId].pointsLost += match.homeScore || 0;
      
      if (match.winnerId === homeTeamId) {
        standings[homeTeamId].wins++;
        standings[homeTeamId].points += 3;
        standings[awayTeamId].losses++;
      } else {
        standings[awayTeamId].wins++;
        standings[awayTeamId].points += 3;
        standings[homeTeamId].losses++;
      }
    }
    
    // Save standings
    const standingsKey = `standings:${tournamentId}:${category}:${division}`;
    await kv.set(standingsKey, {
      tournamentId,
      category,
      division,
      standings: Object.values(standings),
      updatedAt: new Date().toISOString()
    });
    
    console.log(`✅ Classificação atualizada: ${category} - ${division}ª Divisão`);
  } catch (error) {
    console.error('❌ Error calculating standings:', error);
  }
}

// Helper function to notify participants
async function notifyParticipants(tournamentId: string, category: string, division: string, match: any) {
  try {
    // Get all participants from this category/division
    const tournamentKey = `tournament:${tournamentId}`;
    const tournament = await kv.get(tournamentKey);
    
    if (!tournament || !tournament.registeredTeams) {
      return 0;
    }
    
    // Get team members
    const participants: string[] = [];
    for (const teamId of tournament.registeredTeams) {
      const team = await kv.get(`user:${teamId}`);
      if (team && team.teamMembers) {
        participants.push(...team.teamMembers);
      }
      // Add team itself
      participants.push(teamId);
    }
    
    // Create notification
    const notificationId = crypto.randomUUID();
    const notification = {
      id: notificationId,
      tournamentId,
      category,
      division,
      matchId: match.id,
      type: 'match_result',
      title: 'Resultado Registrado',
      message: `Resultado: ${match.homeTeamName || match.homeTeamId} ${match.homeSets} × ${match.awaySets} ${match.awayTeamName || match.awayTeamId}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // Save notification for each participant
    for (const participantId of participants) {
      const key = `notification:${participantId}:${notificationId}`;
      await kv.set(key, notification);
    }
    
    console.log(`📧 ${participants.length} participantes notificados`);
    return participants.length;
  } catch (error) {
    console.error('❌ Error notifying participants:', error);
    return 0;
  }
}

// Start match (set status to live)
app.post('/make-server-0ea22bba/tournament/match/start', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const { tournamentId, matchId, category, division } = await c.req.json();
    
    const tournamentKey = `tournament:${tournamentId}`;
    const tournament = await kv.get(tournamentKey);
    
    if (!tournament || tournament.organizerId !== userId) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    const matchKey = `match:${tournamentId}:${category}:${division}:${matchId}`;
    const match = await kv.get(matchKey);
    
    if (!match) {
      return c.json({ error: 'Match not found' }, 404);
    }
    
    match.status = 'live';
    match.startedAt = new Date().toISOString();
    await kv.set(matchKey, match);
    
    // Notify participants
    await notifyMatchStarting(tournamentId, category, division, match);
    
    return c.json({ success: true, match });
  } catch (error: any) {
    console.error('❌ Error starting match:', error);
    return c.json({ error: error.message }, 500);
  }
});

async function notifyMatchStarting(tournamentId: string, category: string, division: string, match: any) {
  const notificationId = crypto.randomUUID();
  const notification = {
    id: notificationId,
    tournamentId,
    category,
    division,
    matchId: match.id,
    type: 'match_starting',
    title: 'Partida Iniciada',
    message: `Jogo ao vivo: ${match.homeTeamName || match.homeTeamId} vs ${match.awayTeamName || match.awayTeamId}`,
    timestamp: new Date().toISOString(),
    read: false
  };
  
  // Salvar notificações (simplificado)
  const key = `notification:tournament:${tournamentId}:${notificationId}`;
  await kv.set(key, notification);
}

// Get notifications for user
app.get('/make-server-0ea22bba/tournament/notifications', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.query('tournamentId');
    const category = c.req.query('category');
    const division = c.req.query('division');
    
    // Get user notifications
    const allNotifications = await kv.getByPrefix(`notification:${userId}:`);
    
    // Filter by tournament/category/division if provided
    let notifications = allNotifications;
    if (tournamentId) {
      notifications = notifications.filter((n: any) => n.tournamentId === tournamentId);
    }
    if (category) {
      notifications = notifications.filter((n: any) => n.category === category);
    }
    if (division) {
      notifications = notifications.filter((n: any) => n.division === division);
    }
    
    // Sort by timestamp, newest first
    notifications.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return c.json({ notifications });
  } catch (error: any) {
    console.error('❌ Error getting notifications:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get notification history
app.get('/make-server-0ea22bba/tournament/notifications/history', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = c.req.query('tournamentId');
    
    const allNotifications = await kv.getByPrefix(`notification:${userId}:`);
    
    let notifications = allNotifications;
    if (tournamentId) {
      notifications = notifications.filter((n: any) => n.tournamentId === tournamentId);
    }
    
    notifications.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return c.json({ notifications: notifications.slice(0, 50) }); // últimas 50
  } catch (error: any) {
    console.error('❌ Error getting notification history:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get current standings
app.get('/make-server-0ea22bba/tournament/standings', async (c) => {
  try {
    const tournamentId = c.req.query('tournamentId');
    const category = c.req.query('category');
    const division = c.req.query('division');
    
    if (!tournamentId || !category || !division) {
      return c.json({ error: 'Missing required parameters' }, 400);
    }
    
    const standingsKey = `standings:${tournamentId}:${category}:${division}`;
    const standingsData = await kv.get(standingsKey);
    
    if (!standingsData) {
      return c.json({ standings: [] });
    }
    
    // Sort standings by points, then by set difference
    const standings = standingsData.standings || [];
    standings.sort((a: any, b: any) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      const aSetDiff = a.setsWon - a.setsLost;
      const bSetDiff = b.setsWon - b.setsLost;
      return bSetDiff - aSetDiff;
    });
    
    return c.json({ standings, updatedAt: standingsData.updatedAt });
  } catch (error: any) {
    console.error('❌ Error getting standings:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= MESSAGES ROUTES =============

// Get conversations for current user
app.get('/make-server-0ea22bba/messages/conversations', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    console.log('💬 Getting conversations for user:', userId);
    
    // Get all conversation keys for this user
    const allConversations = await kv.getByPrefix(`conversation:${userId}:`);
    const conversations = [];
    
    for (const conv of allConversations) {
      // Get the other user's profile
      const otherUserId = conv.otherUserId;
      const otherUser = await kv.get(`user:${otherUserId}`);
      
      if (otherUser) {
        conversations.push({
          userId: otherUserId,
          name: otherUser.name || otherUser.nickname,
          photoUrl: otherUser.photoUrl,
          verified: otherUser.verified,
          lastMessage: conv.lastMessage,
          lastMessageAt: conv.lastMessageAt,
          unreadCount: conv.unreadCount || 0,
        });
      }
    }
    
    // Sort by last message time
    conversations.sort((a: any, b: any) => 
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
    
    console.log(`✅ Found ${conversations.length} conversations`);
    return c.json({ conversations });
  } catch (error: any) {
    console.error('❌ Error getting conversations:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get messages between two users
app.get('/make-server-0ea22bba/messages/:otherUserId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const otherUserId = c.req.param('otherUserId');
    
    console.log('💬 Getting messages between:', userId, 'and', otherUserId);
    
    // Create conversation ID (always use same order for consistency)
    const conversationId = [userId, otherUserId].sort().join(':');
    
    // Get all messages for this conversation
    const messages = await kv.getByPrefix(`message:${conversationId}:`);
    
    // Sort by timestamp
    messages.sort((a: any, b: any) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    console.log(`✅ Found ${messages.length} messages`);
    return c.json({ messages });
  } catch (error: any) {
    console.error('❌ Error getting messages:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Send message
app.post('/make-server-0ea22bba/messages/:otherUserId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const otherUserId = c.req.param('otherUserId');
    const { content } = await c.req.json();
    
    if (!content?.trim()) {
      return c.json({ error: 'Message content is required' }, 400);
    }
    
    console.log('💬 Sending message from:', userId, 'to:', otherUserId);
    
    // Get sender profile
    const senderProfile = await kv.get(`user:${userId}`);
    if (!senderProfile) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Create conversation ID (always use same order)
    const conversationId = [userId, otherUserId].sort().join(':');
    const timestamp = new Date().toISOString();
    const messageId = crypto.randomUUID();
    
    // Create message
    const message = {
      id: messageId,
      conversationId,
      senderId: userId,
      senderName: senderProfile.name || senderProfile.nickname,
      senderPhotoUrl: senderProfile.photoUrl,
      content: content.trim(),
      timestamp,
      read: false,
    };
    
    // Save message
    await kv.set(`message:${conversationId}:${timestamp}:${messageId}`, message);
    
    // Update conversation metadata for sender
    await kv.set(`conversation:${userId}:${otherUserId}`, {
      otherUserId,
      lastMessage: content.trim(),
      lastMessageAt: timestamp,
      unreadCount: 0, // Sender has no unread
    });
    
    // Update conversation metadata for receiver
    const receiverConv = await kv.get(`conversation:${otherUserId}:${userId}`) || {};
    await kv.set(`conversation:${otherUserId}:${userId}`, {
      otherUserId: userId,
      lastMessage: content.trim(),
      lastMessageAt: timestamp,
      unreadCount: (receiverConv.unreadCount || 0) + 1,
    });
    
    console.log('✅ Message sent successfully');
    return c.json({ message });
  } catch (error: any) {
    console.error('❌ Error sending message:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Mark messages as read
app.post('/make-server-0ea22bba/messages/:otherUserId/read', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const otherUserId = c.req.param('otherUserId');
    
    console.log('👁️ Marking messages as read from:', otherUserId, 'to:', userId);
    
    // Update conversation to mark as read
    const conv = await kv.get(`conversation:${userId}:${otherUserId}`) || {};
    await kv.set(`conversation:${userId}:${otherUserId}`, {
      ...conv,
      unreadCount: 0,
    });
    
    console.log('✅ Messages marked as read');
    return c.json({ success: true });
  } catch (error: any) {
    console.error('❌ Error marking messages as read:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= TEAM ROSTER MANAGEMENT =============

// Get team roster/players
app.get('/make-server-0ea22bba/teams/:teamId/players', async (c) => {
  try {
    const teamId = c.req.param('teamId');
    
    console.log('🔍 Loading players for team:', teamId);
    
    // Get all players for this team
    const playersKey = `team:${teamId}:players`;
    const players = await kv.get(playersKey) || [];
    
    console.log('✅ Players loaded:', players.length);
    
    return c.json({ 
      players,
      total: players.length
    });
  } catch (error: any) {
    console.error('❌ Error loading team players:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Add player to team roster
app.post('/make-server-0ea22bba/teams/:teamId/players', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const teamId = c.req.param('teamId');
    const body = await c.req.json();
    
    console.log('➕ Adding player to team:', teamId, body);
    
    // Check if user is the team owner
    const team = await kv.get(`user:${teamId}`);
    if (!team || team.id !== teamId) {
      return c.json({ error: 'Team not found' }, 404);
    }
    
    // Only team owner can add players
    if (userId !== teamId) {
      return c.json({ error: 'Only team owner can add players' }, 403);
    }
    
    // Get current roster
    const playersKey = `team:${teamId}:players`;
    const players = await kv.get(playersKey) || [];
    
    // Create new player
    const newPlayer = {
      id: body.id || `player_${Date.now()}`,
      name: body.name,
      position: body.position,
      number: body.number,
      age: body.age,
      height: body.height,
      photoUrl: body.photoUrl,
      cpf: body.cpf,
      isCaptain: body.isCaptain || false,
      isStarter: body.isStarter || false,
      gamesPlayed: body.gamesPlayed || 0,
      points: body.points || 0,
      addedAt: new Date().toISOString(),
    };
    
    // Check if player already exists (by CPF or ID)
    const existingPlayer = players.find((p: any) => 
      (p.cpf && body.cpf && p.cpf === body.cpf) || p.id === body.id
    );
    
    if (existingPlayer) {
      return c.json({ error: 'Player already in roster' }, 409);
    }
    
    // Add to roster
    players.push(newPlayer);
    await kv.set(playersKey, players);
    
    console.log('✅ Player added to roster:', newPlayer.id);
    
    return c.json({ 
      player: newPlayer,
      success: true
    });
  } catch (error: any) {
    console.error('❌ Error adding player:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update player in roster
app.put('/make-server-0ea22bba/teams/:teamId/players/:playerId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const teamId = c.req.param('teamId');
    const playerId = c.req.param('playerId');
    const updates = await c.req.json();
    
    console.log('✏️ Updating player:', playerId, 'in team:', teamId);
    
    // Only team owner can update players
    if (userId !== teamId) {
      return c.json({ error: 'Only team owner can update players' }, 403);
    }
    
    // Get current roster
    const playersKey = `team:${teamId}:players`;
    const players = await kv.get(playersKey) || [];
    
    // Find and update player
    const playerIndex = players.findIndex((p: any) => p.id === playerId);
    if (playerIndex === -1) {
      return c.json({ error: 'Player not found' }, 404);
    }
    
    players[playerIndex] = {
      ...players[playerIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(playersKey, players);
    
    console.log('✅ Player updated:', playerId);
    
    return c.json({ 
      player: players[playerIndex],
      success: true
    });
  } catch (error: any) {
    console.error('❌ Error updating player:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Remove player from roster
app.delete('/make-server-0ea22bba/teams/:teamId/players/:playerId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const teamId = c.req.param('teamId');
    const playerId = c.req.param('playerId');
    
    console.log('🗑️ Removing player:', playerId, 'from team:', teamId);
    
    // Only team owner can remove players
    if (userId !== teamId) {
      return c.json({ error: 'Only team owner can remove players' }, 403);
    }
    
    // Get current roster
    const playersKey = `team:${teamId}:players`;
    const players = await kv.get(playersKey) || [];
    
    // Remove player
    const updatedPlayers = players.filter((p: any) => p.id !== playerId);
    
    if (updatedPlayers.length === players.length) {
      return c.json({ error: 'Player not found' }, 404);
    }
    
    await kv.set(playersKey, updatedPlayers);
    
    console.log('✅ Player removed:', playerId);
    
    return c.json({ 
      success: true,
      message: 'Player removed from roster'
    });
  } catch (error: any) {
    console.error('❌ Error removing player:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Search athlete by CPF
app.get('/make-server-0ea22bba/athletes/search', async (c) => {
  try {
    const cpf = c.req.query('cpf');
    
    if (!cpf) {
      return c.json({ error: 'CPF is required' }, 400);
    }
    
    console.log('🔍 Searching athlete by CPF:', cpf);
    
    // Search in all users
    const allUsers = await kv.getByPrefix('user:');
    const athlete = allUsers.find((user: any) => 
      user.userType === 'athlete' && user.cpf === cpf
    );
    
    if (!athlete) {
      return c.json({ error: 'Athlete not found' }, 404);
    }
    
    console.log('✅ Athlete found:', athlete.name);
    
    return c.json({ 
      athlete: {
        id: athlete.id,
        name: athlete.name,
        position: athlete.position,
        age: athlete.age,
        height: athlete.height,
        photoUrl: athlete.photoUrl,
        cpf: athlete.cpf,
        currentTeam: athlete.currentTeam
      }
    });
  } catch (error: any) {
    console.error('❌ Error searching athlete:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= FILE UPLOAD ROUTES =============

// Upload file to Supabase Storage
app.post('/make-server-0ea22bba/upload', authMiddleware, async (c) => {
  try {
    console.log('📤 [UPLOAD] File upload request received');
    
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;
    
    if (!file) {
      console.error('❌ [UPLOAD] No file provided');
      return c.json({ error: 'No file provided' }, 400);
    }
    
    if (!path) {
      console.error('❌ [UPLOAD] No path provided');
      return c.json({ error: 'No path provided' }, 400);
    }
    
    console.log('📤 [UPLOAD] File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      path: path
    });
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);
    
    console.log('📤 [UPLOAD] Uploading to Supabase Storage...');
    
    // Upload to Supabase Storage
    const bucketName = 'make-0ea22bba-uploads';
    
    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log('📦 [UPLOAD] Creating bucket:', bucketName);
      await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 52428800, // 50MB
      });
    }
    
    // Upload file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(path, fileData, {
        contentType: file.type,
        upsert: true,
      });
    
    if (uploadError) {
      console.error('❌ [UPLOAD] Upload error:', uploadError);
      return c.json({ error: uploadError.message }, 500);
    }
    
    console.log('✅ [UPLOAD] File uploaded:', uploadData.path);
    
    // Generate signed URL (valid for 1 year)
    const { data: urlData, error: urlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(path, 31536000); // 1 year in seconds
    
    if (urlError) {
      console.error('❌ [UPLOAD] Error generating signed URL:', urlError);
      return c.json({ error: urlError.message }, 500);
    }
    
    console.log('✅ [UPLOAD] Signed URL generated');
    
    return c.json({ 
      url: urlData.signedUrl,
      path: uploadData.path
    });
  } catch (error: any) {
    console.error('❌ [UPLOAD] Error:', error);
    console.error('❌ [UPLOAD] Stack:', error.stack);
    return c.json({ error: error.message }, 500);
  }
});

// ============= PEOPLE SEARCH ROUTE =============

// GET /search/people - Buscar pessoas por nome ou CPF
app.get('/make-server-0ea22bba/search/people', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const token = authHeader.replace('Bearer ', '');
    const supabaseClient = await initializeSupabase();
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const query = c.req.query('q')?.toLowerCase() || '';
    
    if (query.length < 2) {
      return c.json({ people: [] });
    }
    
    const kvStore = await initializeKV();
    
    // Buscar em todos os usuários
    const allUsers = await kvStore.getByPrefix('user:');
    
    // Filtrar por nome ou CPF
    const filtered = allUsers.filter((person: any) => {
      const matchName = person.name?.toLowerCase().includes(query);
      const matchCPF = person.cpf?.includes(query);
      return matchName || matchCPF;
    });
    
    // Formatar resultados
    const results = filtered.slice(0, 20).map((person: any) => ({
      id: person.id,
      name: person.name,
      email: person.email,
      cpf: person.cpf,
      type: person.type || 'other',
      avatar: person.avatar
    }));
    
    console.log(`🔍 Search people: query="${query}", found=${results.length}`);
    
    return c.json({ people: results });
  } catch (error: any) {
    console.error('Error searching people:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= TOURNAMENT ORGANIZERS ROUTES =============

// GET /tournaments/:id/organizers - Listar equipe organizadora
app.get('/make-server-0ea22bba/tournaments/:id/organizers', async (c) => {
  try {
    const tournamentId = c.req.param('id');
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const token = authHeader.replace('Bearer ', '');
    const supabaseClient = await initializeSupabase();
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const kvStore = await initializeKV();
    
    // Buscar torneio
    const tournament = await kvStore.get(`tournament:${tournamentId}`);
    
    // Buscar criador do torneio
    const creator = await kvStore.get(`user:${tournament?.createdBy}`);
    
    // Buscar organizadores do torneio
    const organizers = await kvStore.getByPrefix(`tournament:${tournamentId}:organizer:`);
    
    // Adicionar criador à lista
    const allOrganizers = creator ? [{
      id: creator.id,
      userId: creator.id,
      email: creator.email,
      name: creator.name,
      cpf: creator.cpf,
      type: creator.type,
      role: 'creator',
      addedAt: tournament?.createdAt || new Date().toISOString()
    }] : [];
    
    // Adicionar demais organizadores
    organizers.forEach((org: any) => {
      allOrganizers.push({
        id: org.userId,
        userId: org.userId,
        email: org.email,
        name: org.name,
        cpf: org.cpf,
        type: org.type,
        role: org.role,
        addedAt: org.addedAt
      });
    });
    
    return c.json({ organizers: allOrganizers });
  } catch (error: any) {
    console.error('Error loading organizers:', error);
    return c.json({ error: error.message }, 500);
  }
});

// POST /tournaments/:id/organizers - Adicionar organizador
app.post('/make-server-0ea22bba/tournaments/:id/organizers', async (c) => {
  try {
    const tournamentId = c.req.param('id');
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const token = authHeader.replace('Bearer ', '');
    const supabaseClient = await initializeSupabase();
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const kvStore = await initializeKV();
    
    // Verificar se é o criador do torneio
    const tournament = await kvStore.get(`tournament:${tournamentId}`);
    if (!tournament || tournament.createdBy !== user.id) {
      return c.json({ error: 'Only the creator can add organizers' }, 403);
    }
    
    const { userId, name, email, cpf, type } = await c.req.json();
    
    if (!userId) {
      return c.json({ error: 'userId is required' }, 400);
    }
    
    // Buscar usuário pelo ID
    const targetUser = await kvStore.get(`user:${userId}`);
    
    if (!targetUser) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Verificar se já não é organizador
    const existingOrg = await kvStore.get(`tournament:${tournamentId}:organizer:${targetUser.id}`);
    if (existingOrg) {
      return c.json({ error: 'User is already an organizer' }, 400);
    }
    
    // Adicionar como organizador
    await kvStore.set(`tournament:${tournamentId}:organizer:${targetUser.id}`, {
      userId: targetUser.id,
      email: email || targetUser.email,
      name: name || targetUser.name,
      cpf: cpf || targetUser.cpf,
      type: type || targetUser.type,
      role: 'organizer',
      addedAt: new Date().toISOString(),
      addedBy: user.id
    });
    
    console.log(`✅ Organizer added to tournament ${tournamentId}: ${targetUser.email}`);
    
    return c.json({ 
      success: true,
      organizer: {
        id: targetUser.id,
        email: targetUser.email,
        name: targetUser.name,
        role: 'organizer'
      }
    });
  } catch (error: any) {
    console.error('Error adding organizer:', error);
    return c.json({ error: error.message }, 500);
  }
});

// DELETE /tournaments/:id/organizers/:userId - Remover organizador
app.delete('/make-server-0ea22bba/tournaments/:id/organizers/:userId', async (c) => {
  try {
    const tournamentId = c.req.param('id');
    const userIdToRemove = c.req.param('userId');
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const token = authHeader.replace('Bearer ', '');
    const supabaseClient = await initializeSupabase();
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const kvStore = await initializeKV();
    
    // Verificar se é o criador do torneio
    const tournament = await kvStore.get(`tournament:${tournamentId}`);
    if (!tournament || tournament.createdBy !== user.id) {
      return c.json({ error: 'Only the creator can remove organizers' }, 403);
    }
    
    // Remover organizador
    await kvStore.del(`tournament:${tournamentId}:organizer:${userIdToRemove}`);
    
    console.log(`✅ Organizer removed from tournament ${tournamentId}: ${userIdToRemove}`);
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('Error removing organizer:', error);
    return c.json({ error: error.message }, 500);
  }
});

// GET /tournaments/:id/can-edit - Verificar se usuário pode editar torneio
app.get('/make-server-0ea22bba/tournaments/:id/can-edit', async (c) => {
  try {
    const tournamentId = c.req.param('id');
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader) {
      return c.json({ canEdit: false, isCreator: false });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const supabaseClient = await initializeSupabase();
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    
    if (!user) {
      return c.json({ canEdit: false, isCreator: false });
    }
    
    const kvStore = await initializeKV();
    
    // Verificar se é o criador
    const tournament = await kvStore.get(`tournament:${tournamentId}`);
    const isCreator = tournament?.createdBy === user.id;
    
    // Verificar se é organizador
    const isOrganizer = !!(await kvStore.get(`tournament:${tournamentId}:organizer:${user.id}`));
    
    return c.json({ 
      canEdit: isCreator || isOrganizer,
      isCreator,
      isOrganizer
    });
  } catch (error: any) {
    console.error('Error checking edit permission:', error);
    return c.json({ canEdit: false, isCreator: false });
  }
});

// ============= TOURNAMENT ORGANIZERS & SPONSORS ROUTES =============

// Get tournament organizers
app.get('/make-server-0ea22bba/tournaments/:tournamentId/organizers', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = parseInt(c.req.param('tournamentId'));
    
    console.log(`📋 Buscando organizadores do torneio ${tournamentId}`);
    
    // Verificar se é organizador/criador
    const tournament = await kv.get(`tournament:${tournamentId}`);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    const isCreator = tournament.createdBy === userId;
    const isOrganizer = !!(await kv.get(`tournament:${tournamentId}:organizer:${userId}`));
    
    if (!isCreator && !isOrganizer) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // Buscar lista de organizadores
    const organizersData = await kv.get(`tournament:${tournamentId}:organizers`) || [];
    
    // Adicionar criador à lista (sempre)
    const creator = await kv.get(`user:${tournament.createdBy}`);
    const organizers = [
      {
        id: tournament.createdBy,
        email: creator?.email || '',
        name: creator?.name || '',
        role: 'creator',
        addedAt: tournament.createdAt
      },
      ...organizersData
    ];
    
    return c.json({ organizers });
  } catch (error: any) {
    console.error('❌ Erro ao buscar organizadores:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Add tournament organizer
app.post('/make-server-0ea22bba/tournaments/:tournamentId/organizers', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = parseInt(c.req.param('tournamentId'));
    const { email } = await c.req.json();
    
    console.log(`➕ Adicionando organizador ${email} ao torneio ${tournamentId}`);
    
    // Verificar se é o criador
    const tournament = await kv.get(`tournament:${tournamentId}`);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    if (tournament.createdBy !== userId) {
      return c.json({ error: 'Only the creator can add organizers' }, 403);
    }
    
    // Buscar usuário pelo email
    const allUsers = await kv.getByPrefix('user:');
    const user = allUsers.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return c.json({ error: 'User not found. They must have a VolleyPro account first.' }, 404);
    }
    
    // Verificar se já é organizador
    const organizers = await kv.get(`tournament:${tournamentId}:organizers`) || [];
    if (organizers.some((o: any) => o.id === user.id)) {
      return c.json({ error: 'User is already an organizer' }, 400);
    }
    
    // Adicionar à lista de organizadores
    const newOrganizer = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: 'organizer',
      addedAt: new Date().toISOString()
    };
    
    organizers.push(newOrganizer);
    await kv.set(`tournament:${tournamentId}:organizers`, organizers);
    
    // Criar chave de permissão rápida
    await kv.set(`tournament:${tournamentId}:organizer:${user.id}`, true);
    
    console.log(`✅ Organizador ${email} adicionado ao torneio ${tournamentId}`);
    
    return c.json({ success: true, organizer: newOrganizer });
  } catch (error: any) {
    console.error('❌ Erro ao adicionar organizador:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Remove tournament organizer
app.delete('/make-server-0ea22bba/tournaments/:tournamentId/organizers/:organizerId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = parseInt(c.req.param('tournamentId'));
    const organizerId = c.req.param('organizerId');
    
    console.log(`🗑️ Removendo organizador ${organizerId} do torneio ${tournamentId}`);
    
    // Verificar se é o criador
    const tournament = await kv.get(`tournament:${tournamentId}`);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    if (tournament.createdBy !== userId) {
      return c.json({ error: 'Only the creator can remove organizers' }, 403);
    }
    
    // Não permitir remover o criador
    if (organizerId === tournament.createdBy) {
      return c.json({ error: 'Cannot remove the tournament creator' }, 400);
    }
    
    // Remover da lista de organizadores
    const organizers = await kv.get(`tournament:${tournamentId}:organizers`) || [];
    const filteredOrganizers = organizers.filter((o: any) => o.id !== organizerId);
    await kv.set(`tournament:${tournamentId}:organizers`, filteredOrganizers);
    
    // Remover chave de permissão
    await kv.del(`tournament:${tournamentId}:organizer:${organizerId}`);
    
    console.log(`✅ Organizador ${organizerId} removido do torneio ${tournamentId}`);
    
    return c.json({ success: true });
  } catch (error: any) {
    console.error('❌ Erro ao remover organizador:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Save tournament LED panel configuration
app.post('/make-server-0ea22bba/tournaments/:tournamentId/led-config', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const tournamentId = parseInt(c.req.param('tournamentId'));
    const { config } = await c.req.json();
    
    console.log(`💾 Salvando configuração do painel LED no torneio ${tournamentId}`);
    
    // Verificar permissão
    const tournament = await kv.get(`tournament:${tournamentId}`);
    if (!tournament) {
      return c.json({ error: 'Tournament not found' }, 404);
    }
    
    const isCreator = tournament.createdBy === userId;
    const isOrganizer = !!(await kv.get(`tournament:${tournamentId}:organizer:${userId}`));
    
    if (!isCreator && !isOrganizer) {
      return c.json({ error: 'Unauthorized' }, 403);
    }
    
    // Atualizar torneio com configuração do painel LED
    tournament.ledPanelConfig = config;
    tournament.updatedAt = new Date().toISOString();
    
    await kv.set(`tournament:${tournamentId}`, tournament);
    
    console.log(`✅ Painel LED configurado no torneio ${tournamentId}`);
    
    return c.json({ success: true, config });
  } catch (error: any) {
    console.error('❌ Erro ao salvar configuração do painel LED:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============= REGISTER TOURNAMENT EDITOR ROUTES =============
console.log('📝 Registrando rotas de edição de torneios...');
addTournamentEditorRoutes(app, kv, authMiddleware);
console.log('✅ Rotas de edição de torneios registradas');

// ============= START SERVER =============
// Initialize server asynchronously to register LiveKit routes
(async () => {
  try {
    // Wait for modules to load
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Try to register LiveKit routes
    const livekitApp = await initializeLiveKit();
    if (livekitApp && typeof livekitApp !== 'function') {
      // livekitApp is a Hono instance, merge its routes
      app.route('/', livekitApp);
      console.log('✅ LiveKit routes registered');
    } else {
      console.log('⚠️ LiveKit routes not available (mock mode)');
    }
  } catch (error: any) {
    console.log('⚠️ LiveKit initialization warning:', error.message);
  } finally {
    // Start server regardless of LiveKit status
    Deno.serve(app.fetch);
    console.log('🚀 Server started successfully');
  }
})();
