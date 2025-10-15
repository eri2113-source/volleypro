# 🗄️ Schema de Banco de Dados - Sistema de Monetização

## Tabelas Necessárias para Implementação Futura

### 1. `user_subscriptions`
```sql
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id VARCHAR(20) NOT NULL, -- 'free', 'pro', 'premium', 'elite'
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'past_due'
  billing_cycle VARCHAR(20) NOT NULL, -- 'monthly', 'yearly'
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  
  -- Datas
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancelled_at TIMESTAMP,
  
  -- Integração com gateway de pagamento
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  
  -- Metadados
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_plan_id ON user_subscriptions(plan_id);
```

---

### 2. `monetization_earnings`
```sql
CREATE TABLE monetization_earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Tipo de receita
  source VARCHAR(50) NOT NULL, -- 'live_donation', 'content_sale', 'sponsorship', 'coaching', 'merchandise', 'subscription'
  
  -- Valores
  gross_amount DECIMAL(10,2) NOT NULL, -- Valor bruto
  commission_rate DECIMAL(5,2) NOT NULL, -- Taxa de comissão (70, 75, 80, 85)
  platform_fee DECIMAL(10,2) NOT NULL, -- Taxa da plataforma
  net_amount DECIMAL(10,2) NOT NULL, -- Valor líquido para o atleta
  currency VARCHAR(3) DEFAULT 'BRL',
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'paid', 'cancelled'
  
  -- Referências
  reference_id UUID, -- ID da transação original (live, post, etc)
  reference_type VARCHAR(50), -- 'live', 'post', 'contract', etc
  
  -- Pagamento
  payout_id UUID,
  paid_at TIMESTAMP,
  payment_method VARCHAR(50), -- 'pix', 'bank_transfer', 'paypal'
  
  -- Metadados
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_monetization_earnings_user_id ON monetization_earnings(user_id);
CREATE INDEX idx_monetization_earnings_source ON monetization_earnings(source);
CREATE INDEX idx_monetization_earnings_status ON monetization_earnings(status);
CREATE INDEX idx_monetization_earnings_created_at ON monetization_earnings(created_at);
```

---

### 3. `advertising_campaigns`
```sql
CREATE TABLE advertising_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES users(id), -- Empresa anunciante
  
  -- Informações da campanha
  name VARCHAR(255) NOT NULL,
  description TEXT,
  quota_id VARCHAR(50) NOT NULL, -- 'starter', 'growth', 'professional', 'enterprise', 'flash'
  
  -- Valores
  budget DECIMAL(10,2) NOT NULL,
  spent DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'BRL',
  
  -- Período
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  duration_days INTEGER NOT NULL,
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'active', 'paused', 'completed', 'cancelled'
  
  -- Segmentação
  targeting JSONB, -- {age, gender, location, interests, account_type}
  
  -- Criativos
  creatives JSONB, -- {banners, texts, images, videos}
  
  -- Métricas
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr DECIMAL(5,2) DEFAULT 0, -- Click Through Rate
  conversions INTEGER DEFAULT 0,
  
  -- Aprovação
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  
  -- Metadados
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_advertising_campaigns_company_id ON advertising_campaigns(company_id);
CREATE INDEX idx_advertising_campaigns_status ON advertising_campaigns(status);
CREATE INDEX idx_advertising_campaigns_start_date ON advertising_campaigns(start_date);
CREATE INDEX idx_advertising_campaigns_end_date ON advertising_campaigns(end_date);
```

---

### 4. `advertising_impressions`
```sql
CREATE TABLE advertising_impressions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES advertising_campaigns(id) ON DELETE CASCADE,
  
  -- Usuário que viu o anúncio
  user_id UUID REFERENCES users(id),
  
  -- Tipo de exibição
  placement VARCHAR(50) NOT NULL, -- 'feed_banner', 'sidebar_banner', 'story', 'live_ad', etc
  
  -- Ação
  action VARCHAR(20) NOT NULL DEFAULT 'impression', -- 'impression', 'click', 'conversion'
  
  -- Contexto
  page_url TEXT,
  device VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
  user_agent TEXT,
  ip_address INET,
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_advertising_impressions_campaign_id ON advertising_impressions(campaign_id);
CREATE INDEX idx_advertising_impressions_action ON advertising_impressions(action);
CREATE INDEX idx_advertising_impressions_created_at ON advertising_impressions(created_at);

-- Particionamento por data para performance
-- CREATE TABLE advertising_impressions_y2025m01 PARTITION OF advertising_impressions
--   FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

---

### 5. `sponsorship_contracts`
```sql
CREATE TABLE sponsorship_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Partes
  sponsor_id UUID NOT NULL REFERENCES users(id), -- Empresa patrocinadora
  athlete_id UUID NOT NULL REFERENCES users(id), -- Atleta patrocinado
  
  -- Detalhes do contrato
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Valores
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  payment_frequency VARCHAR(20), -- 'one_time', 'monthly', 'per_post', 'per_event'
  
  -- Período
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'active', 'completed', 'cancelled'
  
  -- Termos
  deliverables JSONB, -- [{type: 'post', quantity: 5, platform: 'feed'}]
  terms TEXT,
  
  -- Assinaturas
  sponsor_signed_at TIMESTAMP,
  athlete_signed_at TIMESTAMP,
  
  -- Pagamentos
  total_paid DECIMAL(10,2) DEFAULT 0,
  
  -- Metadados
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_sponsorship_contracts_sponsor_id ON sponsorship_contracts(sponsor_id);
CREATE INDEX idx_sponsorship_contracts_athlete_id ON sponsorship_contracts(athlete_id);
CREATE INDEX idx_sponsorship_contracts_status ON sponsorship_contracts(status);
```

---

### 6. `content_purchases`
```sql
CREATE TABLE content_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Comprador e vendedor
  buyer_id UUID NOT NULL REFERENCES users(id),
  seller_id UUID NOT NULL REFERENCES users(id),
  
  -- Conteúdo comprado
  content_id UUID NOT NULL, -- Pode ser post, video, etc
  content_type VARCHAR(50) NOT NULL, -- 'post', 'video', 'ebook', 'tutorial', 'coaching_session'
  
  -- Valores
  amount DECIMAL(10,2) NOT NULL,
  seller_commission DECIMAL(10,2) NOT NULL, -- Quanto o vendedor recebe
  platform_fee DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'refunded'
  
  -- Pagamento
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  
  -- Acesso
  access_granted BOOLEAN DEFAULT FALSE,
  accessed_at TIMESTAMP,
  
  -- Metadados
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_content_purchases_buyer_id ON content_purchases(buyer_id);
CREATE INDEX idx_content_purchases_seller_id ON content_purchases(seller_id);
CREATE INDEX idx_content_purchases_content_id ON content_purchases(content_id);
CREATE INDEX idx_content_purchases_status ON content_purchases(status);
```

---

### 7. `fan_club_memberships`
```sql
CREATE TABLE fan_club_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Fan e Atleta
  fan_id UUID NOT NULL REFERENCES users(id),
  athlete_id UUID NOT NULL REFERENCES users(id),
  
  -- Tier da assinatura
  tier VARCHAR(20) NOT NULL, -- 'bronze', 'silver', 'gold', 'platinum'
  
  -- Valores
  monthly_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  
  -- Período
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancelled_at TIMESTAMP,
  
  -- Benefícios
  benefits JSONB, -- Lista de benefícios inclusos
  
  -- Integração pagamento
  stripe_subscription_id VARCHAR(255),
  
  -- Metadados
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraint: um fã só pode ter uma assinatura ativa por atleta
  UNIQUE(fan_id, athlete_id, status)
);

-- Índices
CREATE INDEX idx_fan_club_memberships_fan_id ON fan_club_memberships(fan_id);
CREATE INDEX idx_fan_club_memberships_athlete_id ON fan_club_memberships(athlete_id);
CREATE INDEX idx_fan_club_memberships_status ON fan_club_memberships(status);
```

---

### 8. `payouts`
```sql
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Destinatário
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Valores
  gross_amount DECIMAL(10,2) NOT NULL,
  fees DECIMAL(10,2) DEFAULT 0,
  net_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  
  -- Método de pagamento
  payment_method VARCHAR(50) NOT NULL, -- 'pix', 'bank_transfer', 'paypal'
  
  -- Detalhes bancários (criptografados)
  pix_key VARCHAR(255),
  bank_account JSONB, -- {bank, agency, account, account_type}
  
  -- Processamento
  processed_at TIMESTAMP,
  completed_at TIMESTAMP,
  failed_at TIMESTAMP,
  failure_reason TEXT,
  
  -- Referências
  earnings_ids UUID[], -- Array de IDs de earnings inclusos neste payout
  
  -- Recibo
  receipt_url TEXT,
  
  -- Metadados
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_payouts_user_id ON payouts(user_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_payouts_created_at ON payouts(created_at);
```

---

### 9. `monetization_settings`
```sql
CREATE TABLE monetization_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  
  -- Configurações gerais
  monetization_enabled BOOLEAN DEFAULT FALSE,
  
  -- Preços de conteúdo
  default_content_price DECIMAL(10,2),
  
  -- Clube de fãs
  fan_club_enabled BOOLEAN DEFAULT FALSE,
  fan_club_tiers JSONB, -- [{tier: 'bronze', price: 9.90, benefits: [...]}]
  
  -- Lives
  live_donations_enabled BOOLEAN DEFAULT TRUE,
  live_super_chat_enabled BOOLEAN DEFAULT TRUE,
  live_paid_access_enabled BOOLEAN DEFAULT FALSE,
  live_paid_access_price DECIMAL(10,2),
  
  -- Coaching
  coaching_enabled BOOLEAN DEFAULT FALSE,
  coaching_price_per_hour DECIMAL(10,2),
  coaching_availability JSONB, -- {days, hours, timezone}
  
  -- Loja
  store_enabled BOOLEAN DEFAULT FALSE,
  
  -- Dados de pagamento
  payout_method VARCHAR(50), -- 'pix', 'bank_transfer'
  payout_schedule VARCHAR(20) DEFAULT 'monthly', -- 'weekly', 'monthly'
  minimum_payout DECIMAL(10,2) DEFAULT 50.00,
  
  -- PIX
  pix_key VARCHAR(255),
  pix_key_type VARCHAR(20), -- 'cpf', 'cnpj', 'email', 'phone', 'random'
  
  -- Banco
  bank_details JSONB, -- {bank, agency, account, account_type, holder_name, holder_document}
  
  -- Verificação
  tax_id VARCHAR(20), -- CPF ou CNPJ
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  
  -- Metadados
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Views Úteis

### 1. `user_earnings_summary`
```sql
CREATE VIEW user_earnings_summary AS
SELECT 
  user_id,
  COUNT(*) as total_transactions,
  SUM(gross_amount) as total_gross,
  SUM(net_amount) as total_net,
  SUM(CASE WHEN status = 'pending' THEN net_amount ELSE 0 END) as pending_amount,
  SUM(CASE WHEN status = 'paid' THEN net_amount ELSE 0 END) as paid_amount,
  MAX(created_at) as last_earning_date
FROM monetization_earnings
GROUP BY user_id;
```

### 2. `campaign_performance`
```sql
CREATE VIEW campaign_performance AS
SELECT 
  c.id,
  c.name,
  c.budget,
  c.spent,
  COUNT(DISTINCT CASE WHEN i.action = 'impression' THEN i.id END) as impressions,
  COUNT(DISTINCT CASE WHEN i.action = 'click' THEN i.id END) as clicks,
  COUNT(DISTINCT CASE WHEN i.action = 'conversion' THEN i.id END) as conversions,
  CASE 
    WHEN COUNT(DISTINCT CASE WHEN i.action = 'impression' THEN i.id END) > 0
    THEN (COUNT(DISTINCT CASE WHEN i.action = 'click' THEN i.id END)::DECIMAL / 
          COUNT(DISTINCT CASE WHEN i.action = 'impression' THEN i.id END) * 100)
    ELSE 0 
  END as ctr,
  c.status
FROM advertising_campaigns c
LEFT JOIN advertising_impressions i ON c.id = i.campaign_id
GROUP BY c.id, c.name, c.budget, c.spent, c.status;
```

---

## Funções Úteis

### 1. Calcular comissão baseado no plano
```sql
CREATE OR REPLACE FUNCTION get_user_commission_rate(p_user_id UUID, p_source VARCHAR)
RETURNS DECIMAL AS $$
DECLARE
  v_plan_id VARCHAR;
  v_commission DECIMAL;
BEGIN
  -- Buscar plano do usuário
  SELECT plan_id INTO v_plan_id
  FROM user_subscriptions
  WHERE user_id = p_user_id AND status = 'active'
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Retornar comissão baseado no plano e fonte
  v_commission := CASE 
    WHEN v_plan_id = 'elite' THEN
      CASE p_source
        WHEN 'live_donation' THEN 80
        WHEN 'content_sale' THEN 80
        WHEN 'sponsorship' THEN 85
        WHEN 'coaching' THEN 85
        WHEN 'merchandise' THEN 75
        WHEN 'subscription' THEN 80
        ELSE 70
      END
    WHEN v_plan_id = 'premium' THEN
      CASE p_source
        WHEN 'live_donation' THEN 70
        WHEN 'content_sale' THEN 75
        WHEN 'sponsorship' THEN 80
        WHEN 'coaching' THEN 85
        WHEN 'merchandise' THEN 70
        WHEN 'subscription' THEN 80
        ELSE 70
      END
    ELSE 0 -- Free e Pro não podem monetizar
  END;
  
  RETURN v_commission;
END;
$$ LANGUAGE plpgsql;
```

### 2. Registrar ganho
```sql
CREATE OR REPLACE FUNCTION register_earning(
  p_user_id UUID,
  p_source VARCHAR,
  p_gross_amount DECIMAL,
  p_reference_id UUID DEFAULT NULL,
  p_reference_type VARCHAR DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_commission_rate DECIMAL;
  v_net_amount DECIMAL;
  v_platform_fee DECIMAL;
  v_earning_id UUID;
BEGIN
  -- Calcular comissão
  v_commission_rate := get_user_commission_rate(p_user_id, p_source);
  
  -- Calcular valores
  v_net_amount := p_gross_amount * (v_commission_rate / 100);
  v_platform_fee := p_gross_amount - v_net_amount;
  
  -- Inserir registro
  INSERT INTO monetization_earnings (
    user_id, source, gross_amount, commission_rate, 
    platform_fee, net_amount, reference_id, reference_type, description
  )
  VALUES (
    p_user_id, p_source, p_gross_amount, v_commission_rate,
    v_platform_fee, v_net_amount, p_reference_id, p_reference_type, p_description
  )
  RETURNING id INTO v_earning_id;
  
  RETURN v_earning_id;
END;
$$ LANGUAGE plpgsql;
```

---

## Triggers

### 1. Atualizar métricas de campanha
```sql
CREATE OR REPLACE FUNCTION update_campaign_metrics()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE advertising_campaigns
  SET 
    impressions = impressions + CASE WHEN NEW.action = 'impression' THEN 1 ELSE 0 END,
    clicks = clicks + CASE WHEN NEW.action = 'click' THEN 1 ELSE 0 END,
    conversions = conversions + CASE WHEN NEW.action = 'conversion' THEN 1 ELSE 0 END,
    ctr = CASE 
      WHEN impressions > 0 THEN (clicks::DECIMAL / impressions * 100)
      ELSE 0
    END
  WHERE id = NEW.campaign_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_campaign_metrics
AFTER INSERT ON advertising_impressions
FOR EACH ROW
EXECUTE FUNCTION update_campaign_metrics();
```

---

## RLS (Row Level Security) Policies

### Exemplo para monetization_earnings
```sql
-- Habilitar RLS
ALTER TABLE monetization_earnings ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver apenas seus próprios ganhos
CREATE POLICY "Users can view own earnings"
  ON monetization_earnings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Apenas admin pode inserir ganhos
CREATE POLICY "Only admin can insert earnings"
  ON monetization_earnings
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## Seeds para Desenvolvimento

```sql
-- Inserir planos padrão
INSERT INTO subscription_plans (id, name, price, billing_cycle) VALUES
('free', 'Free', 0, 'monthly'),
('pro', 'Pro', 19.90, 'monthly'),
('premium', 'Premium', 49.90, 'monthly'),
('elite', 'Elite', 99.90, 'monthly');

-- Inserir comissões padrão
INSERT INTO commission_rates (plan_id, source, rate) VALUES
('premium', 'live_donation', 70),
('premium', 'content_sale', 75),
('premium', 'sponsorship', 80),
('premium', 'coaching', 85),
('premium', 'merchandise', 70),
('premium', 'subscription', 80),
('elite', 'live_donation', 80),
('elite', 'content_sale', 80),
('elite', 'sponsorship', 85),
('elite', 'coaching', 85),
('elite', 'merchandise', 75),
('elite', 'subscription', 80);
```

---

## Migração Inicial

```sql
-- Migration: 001_create_monetization_tables.sql

BEGIN;

-- Criar todas as tabelas
-- ... (código das tabelas acima)

-- Criar views
-- ... (código das views acima)

-- Criar funções
-- ... (código das funções acima)

-- Criar triggers
-- ... (código dos triggers acima)

-- Aplicar RLS
-- ... (código do RLS acima)

COMMIT;
```

---

## Próximos Passos para Implementação

1. **Backend**:
   - [ ] Criar migrations com as tabelas acima
   - [ ] Implementar funções de servidor para processar pagamentos
   - [ ] Integrar com gateway de pagamento (Stripe/Mercado Pago)
   - [ ] Criar endpoints de API para monetização
   - [ ] Implementar webhooks para eventos de pagamento

2. **Frontend**:
   - [ ] Conectar componentes de monetização com backend
   - [ ] Implementar formulários de pagamento
   - [ ] Criar dashboard real com dados do banco
   - [ ] Adicionar notificações de ganhos

3. **Testes**:
   - [ ] Testes unitários das funções
   - [ ] Testes de integração com gateway
   - [ ] Testes de performance com grande volume
   - [ ] Testes de segurança

4. **Deploy**:
   - [ ] Configurar ambiente de produção
   - [ ] Configurar backups automáticos
   - [ ] Monitoramento de transações
   - [ ] Logs de auditoria

---

**🗄️ Schema completo e pronto para implementação! 🚀**
