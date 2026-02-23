-- ============================================================================
-- PLATAFORMA DE GESTIÓN DE BODAS DIGITAL
-- DDL Script - MySQL 8.x
-- Arquitectura: Modular Monolith con Clean Architecture
-- Autor: Arquitecto de Datos Senior
-- Fecha: 2026-02-19
-- ============================================================================
-- Convenciones:
--   • snake_case para todos los identificadores
--   • Tablas en plural
--   • PKs: id (BIGINT UNSIGNED AUTO_INCREMENT)
--   • FKs: <entidad_singular>_id
--   • Timestamps: created_at, updated_at (UTC)
--   • Soft delete: deleted_at (nullable)
--   • DECIMAL(12,2) para dinero (hasta 9,999,999,999.99)
--   • VARCHAR con longitudes explícitas; TEXT solo cuando sea necesario
--   • ENUM solo para conjuntos cerrados y estables
-- ============================================================================

SET NAMES utf8mb4;
SET CHARACTER_SET_CLIENT = utf8mb4;
SET CHARACTER_SET_RESULTS = utf8mb4;

CREATE DATABASE IF NOT EXISTS wedding_platform
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE wedding_platform;

-- ============================================================================
-- MÓDULO 1: IDENTITY & ACCESS (IAM)
-- Responsabilidad: Autenticación, autorización, roles y perfiles
-- ============================================================================

CREATE TABLE users (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                CHAR(36)        NOT NULL,
    email               VARCHAR(255)    NOT NULL,
    password_hash       VARCHAR(255)    NOT NULL,
    email_verified_at   DATETIME        NULL,
    is_active           TINYINT(1)      NOT NULL DEFAULT 1,
    last_login_at       DATETIME        NULL,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at          DATETIME        NULL,

    CONSTRAINT uq_users_uuid  UNIQUE (uuid),
    CONSTRAINT uq_users_email UNIQUE (email)
) ENGINE=InnoDB;

CREATE TABLE roles (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50)     NOT NULL,
    description VARCHAR(255)    NULL,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_roles_name UNIQUE (name)
) ENGINE=InnoDB;

-- Relación N:M → usuarios pueden tener múltiples roles (novio + admin, etc.)
CREATE TABLE user_roles (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL,
    role_id     BIGINT UNSIGNED NOT NULL,
    assigned_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_roles      UNIQUE (user_id, role_id)
) ENGINE=InnoDB;

CREATE TABLE permissions (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL,
    module      VARCHAR(50)     NOT NULL,
    description VARCHAR(255)    NULL,

    CONSTRAINT uq_permissions_name UNIQUE (name)
) ENGINE=InnoDB;

CREATE TABLE role_permissions (
    id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id       BIGINT UNSIGNED NOT NULL,
    permission_id BIGINT UNSIGNED NOT NULL,

    CONSTRAINT fk_role_perms_role FOREIGN KEY (role_id)       REFERENCES roles(id)       ON DELETE CASCADE,
    CONSTRAINT fk_role_perms_perm FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    CONSTRAINT uq_role_permissions UNIQUE (role_id, permission_id)
) ENGINE=InnoDB;

-- Tokens de refresco / sesiones
CREATE TABLE refresh_tokens (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    token_hash      VARCHAR(255)    NOT NULL,
    device_info     VARCHAR(255)    NULL,
    expires_at      DATETIME        NOT NULL,
    revoked_at      DATETIME        NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_refresh_tokens_hash (token_hash),
    INDEX idx_refresh_tokens_expires (expires_at)
) ENGINE=InnoDB;

-- ============================================================================
-- MÓDULO 2: WEDDING CORE
-- Responsabilidad: Entidad central "boda" y todo lo relacionado a los novios
-- ============================================================================

-- Perfil extendido de los novios (1:1 con user)
CREATE TABLE couple_profiles (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT UNSIGNED NOT NULL,
    first_name          VARCHAR(100)    NOT NULL,
    last_name           VARCHAR(100)    NOT NULL,
    phone               VARCHAR(20)     NULL,
    avatar_url          VARCHAR(500)    NULL,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_couple_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_couple_profiles_user UNIQUE (user_id)
) ENGINE=InnoDB;

-- La boda: entidad central que conecta a la pareja
CREATE TABLE weddings (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                CHAR(36)        NOT NULL,
    slug                VARCHAR(100)    NOT NULL,           -- URL amigable: /boda/juan-y-maria
    partner_one_id      BIGINT UNSIGNED NOT NULL,            -- couple_profile
    partner_two_id      BIGINT UNSIGNED NULL,                -- puede registrarse después
    title               VARCHAR(200)    NOT NULL,            -- "La Boda de Juan & María"
    wedding_date        DATE            NULL,
    ceremony_time       TIME            NULL,
    venue_name          VARCHAR(200)    NULL,
    venue_address       VARCHAR(500)    NULL,
    venue_latitude      DECIMAL(10,7)   NULL,
    venue_longitude     DECIMAL(10,7)   NULL,
    total_budget        DECIMAL(12,2)   NULL,
    currency_code       CHAR(3)         NOT NULL DEFAULT 'MXN',
    status              ENUM('draft','planning','confirmed','completed','cancelled')
                                        NOT NULL DEFAULT 'draft',
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at          DATETIME        NULL,

    CONSTRAINT fk_weddings_partner1 FOREIGN KEY (partner_one_id) REFERENCES couple_profiles(id) ON DELETE RESTRICT,
    CONSTRAINT fk_weddings_partner2 FOREIGN KEY (partner_two_id) REFERENCES couple_profiles(id) ON DELETE SET NULL,
    CONSTRAINT uq_weddings_uuid UNIQUE (uuid),
    CONSTRAINT uq_weddings_slug UNIQUE (slug),
    INDEX idx_weddings_date (wedding_date),
    INDEX idx_weddings_status (status)
) ENGINE=InnoDB;

-- ============================================================================
-- MÓDULO 3: GUEST MANAGEMENT
-- Responsabilidad: Invitados, confirmación (RSVP), mesas
-- ============================================================================

-- Grupos de invitados (familia, amigos trabajo, etc.)
CREATE TABLE guest_groups (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    wedding_id  BIGINT UNSIGNED NOT NULL,
    name        VARCHAR(100)    NOT NULL,
    description VARCHAR(255)    NULL,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_guest_groups_wedding FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE,
    INDEX idx_guest_groups_wedding (wedding_id)
) ENGINE=InnoDB;

CREATE TABLE guests (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    wedding_id          BIGINT UNSIGNED NOT NULL,
    guest_group_id      BIGINT UNSIGNED NULL,
    user_id             BIGINT UNSIGNED NULL,               -- vinculado si tiene cuenta
    first_name          VARCHAR(100)    NOT NULL,
    last_name           VARCHAR(100)    NOT NULL,
    email               VARCHAR(255)    NULL,
    phone               VARCHAR(20)     NULL,
    rsvp_status         ENUM('pending','confirmed','declined','tentative')
                                        NOT NULL DEFAULT 'pending',
    rsvp_responded_at   DATETIME        NULL,
    plus_one_allowed    TINYINT(1)      NOT NULL DEFAULT 0,
    plus_one_name       VARCHAR(200)    NULL,
    dietary_restrictions VARCHAR(255)   NULL,
    notes               TEXT            NULL,
    invitation_sent_at  DATETIME        NULL,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_guests_wedding    FOREIGN KEY (wedding_id)     REFERENCES weddings(id)      ON DELETE CASCADE,
    CONSTRAINT fk_guests_group      FOREIGN KEY (guest_group_id) REFERENCES guest_groups(id)   ON DELETE SET NULL,
    CONSTRAINT fk_guests_user       FOREIGN KEY (user_id)        REFERENCES users(id)          ON DELETE SET NULL,
    INDEX idx_guests_wedding        (wedding_id),
    INDEX idx_guests_rsvp           (wedding_id, rsvp_status),
    INDEX idx_guests_email          (email)
) ENGINE=InnoDB;

-- Mesas: asignación de invitados a mesas
CREATE TABLE seating_tables (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    wedding_id      BIGINT UNSIGNED NOT NULL,
    table_number    SMALLINT UNSIGNED NOT NULL,
    table_name      VARCHAR(100)    NULL,                -- "Mesa de Honor", "Mesa 5"
    capacity        TINYINT UNSIGNED NOT NULL DEFAULT 10,
    location_hint   VARCHAR(200)    NULL,                -- "Junto a la pista de baile"
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_seating_tables_wedding FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE,
    CONSTRAINT uq_seating_table_number   UNIQUE (wedding_id, table_number)
) ENGINE=InnoDB;

CREATE TABLE seating_assignments (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    seating_table_id BIGINT UNSIGNED NOT NULL,
    guest_id        BIGINT UNSIGNED NOT NULL,
    seat_number     TINYINT UNSIGNED NULL,
    assigned_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_seating_assign_table FOREIGN KEY (seating_table_id) REFERENCES seating_tables(id) ON DELETE CASCADE,
    CONSTRAINT fk_seating_assign_guest FOREIGN KEY (guest_id)         REFERENCES guests(id)          ON DELETE CASCADE,
    CONSTRAINT uq_seating_guest        UNIQUE (guest_id)              -- un invitado en una sola mesa
) ENGINE=InnoDB;

-- ============================================================================
-- MÓDULO 4: DIGITAL INVITATIONS & WEDDING WEBSITE
-- Responsabilidad: Invitaciones digitales, sitio web personalizado
-- ============================================================================

CREATE TABLE invitation_templates (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    category        VARCHAR(50)     NOT NULL,            -- "elegante", "moderno", "rústico"
    thumbnail_url   VARCHAR(500)    NULL,
    html_template   TEXT            NOT NULL,
    css_template    TEXT            NULL,
    is_premium      TINYINT(1)      NOT NULL DEFAULT 0,
    is_active       TINYINT(1)      NOT NULL DEFAULT 1,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_inv_templates_category (category, is_active)
) ENGINE=InnoDB;

CREATE TABLE invitations (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    wedding_id          BIGINT UNSIGNED NOT NULL,
    template_id         BIGINT UNSIGNED NULL,
    custom_message      TEXT            NULL,
    custom_design_json  JSON            NULL,            -- personalizaciones visuales
    rsvp_deadline       DATE            NULL,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_invitations_wedding  FOREIGN KEY (wedding_id)  REFERENCES weddings(id)              ON DELETE CASCADE,
    CONSTRAINT fk_invitations_template FOREIGN KEY (template_id) REFERENCES invitation_templates(id)   ON DELETE SET NULL,
    INDEX idx_invitations_wedding (wedding_id)
) ENGINE=InnoDB;

-- Envío individual de invitación a cada invitado
CREATE TABLE invitation_deliveries (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invitation_id   BIGINT UNSIGNED NOT NULL,
    guest_id        BIGINT UNSIGNED NOT NULL,
    channel         ENUM('email','whatsapp','sms','link') NOT NULL,
    delivery_status ENUM('pending','sent','delivered','failed','opened')
                                    NOT NULL DEFAULT 'pending',
    sent_at         DATETIME        NULL,
    opened_at       DATETIME        NULL,
    unique_token    VARCHAR(100)    NOT NULL,            -- token único para tracking
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inv_del_invitation FOREIGN KEY (invitation_id) REFERENCES invitations(id) ON DELETE CASCADE,
    CONSTRAINT fk_inv_del_guest      FOREIGN KEY (guest_id)      REFERENCES guests(id)      ON DELETE CASCADE,
    CONSTRAINT uq_inv_del_token      UNIQUE (unique_token),
    INDEX idx_inv_del_status (delivery_status)
) ENGINE=InnoDB;

-- Sitio web personalizado de la boda
CREATE TABLE wedding_websites (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    wedding_id      BIGINT UNSIGNED NOT NULL,
    subdomain       VARCHAR(63)     NOT NULL,            -- juanymaria.boda.app
    theme           VARCHAR(50)     NOT NULL DEFAULT 'default',
    custom_css      TEXT            NULL,
    hero_image_url  VARCHAR(500)    NULL,
    story_content   TEXT            NULL,                 -- historia de la pareja
    is_published    TINYINT(1)      NOT NULL DEFAULT 0,
    password_hash   VARCHAR(255)    NULL,                 -- protección opcional
    config_json     JSON            NULL,                 -- secciones visibles, colores, etc.
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_wedding_websites_wedding FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE,
    CONSTRAINT uq_wedding_websites_subdomain UNIQUE (subdomain),
    CONSTRAINT uq_wedding_websites_wedding   UNIQUE (wedding_id)
) ENGINE=InnoDB;

-- Secciones del sitio web (galería, timeline, dresscode, etc.)
CREATE TABLE website_sections (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    website_id      BIGINT UNSIGNED NOT NULL,
    section_type    VARCHAR(50)     NOT NULL,            -- 'gallery', 'timeline', 'dresscode', 'registry', 'faq'
    title           VARCHAR(200)    NULL,
    content_json    JSON            NOT NULL,
    sort_order      SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    is_visible      TINYINT(1)      NOT NULL DEFAULT 1,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_website_sections_website FOREIGN KEY (website_id) REFERENCES wedding_websites(id) ON DELETE CASCADE,
    INDEX idx_website_sections_order (website_id, sort_order)
) ENGINE=InnoDB;

-- ============================================================================
-- MÓDULO 5: VENDOR MARKETPLACE
-- Responsabilidad: Proveedores, servicios, catálogo, reviews
-- ============================================================================

-- Categorías de servicios (fotografía, catering, floristería, etc.)
CREATE TABLE service_categories (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    slug            VARCHAR(100)    NOT NULL,
    icon_url        VARCHAR(500)    NULL,
    description     VARCHAR(500)    NULL,
    parent_id       BIGINT UNSIGNED NULL,                -- subcategorías
    sort_order      SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    is_active       TINYINT(1)      NOT NULL DEFAULT 1,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_service_cat_parent FOREIGN KEY (parent_id) REFERENCES service_categories(id) ON DELETE SET NULL,
    CONSTRAINT uq_service_cat_slug   UNIQUE (slug)
) ENGINE=InnoDB;

-- Perfil del proveedor (1:1 con user)
CREATE TABLE vendor_profiles (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT UNSIGNED NOT NULL,
    business_name       VARCHAR(200)    NOT NULL,
    slug                VARCHAR(200)    NOT NULL,
    tax_id              VARCHAR(50)     NULL,            -- RFC en México
    description         TEXT            NULL,
    logo_url            VARCHAR(500)    NULL,
    cover_image_url     VARCHAR(500)    NULL,
    phone               VARCHAR(20)     NULL,
    website_url         VARCHAR(500)    NULL,
    city                VARCHAR(100)    NULL,
    state               VARCHAR(100)    NULL,
    country             VARCHAR(100)    NOT NULL DEFAULT 'México',
    latitude            DECIMAL(10,7)   NULL,
    longitude           DECIMAL(10,7)   NULL,
    service_radius_km   SMALLINT UNSIGNED NULL,
    avg_rating          DECIMAL(3,2)    NOT NULL DEFAULT 0.00,  -- calculado, desnormalizado
    total_reviews       INT UNSIGNED    NOT NULL DEFAULT 0,     -- calculado, desnormalizado
    is_verified         TINYINT(1)      NOT NULL DEFAULT 0,
    verification_date   DATETIME        NULL,
    is_featured         TINYINT(1)      NOT NULL DEFAULT 0,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at          DATETIME        NULL,

    CONSTRAINT fk_vendor_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_vendor_profiles_user UNIQUE (user_id),
    CONSTRAINT uq_vendor_profiles_slug UNIQUE (slug),
    INDEX idx_vendor_city_state (city, state),
    INDEX idx_vendor_rating (avg_rating DESC),
    INDEX idx_vendor_featured (is_featured, avg_rating DESC)
) ENGINE=InnoDB;

-- N:M → un proveedor puede ofrecer múltiples categorías
CREATE TABLE vendor_service_categories (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vendor_profile_id   BIGINT UNSIGNED NOT NULL,
    service_category_id BIGINT UNSIGNED NOT NULL,

    CONSTRAINT fk_vsc_vendor   FOREIGN KEY (vendor_profile_id)   REFERENCES vendor_profiles(id)    ON DELETE CASCADE,
    CONSTRAINT fk_vsc_category FOREIGN KEY (service_category_id) REFERENCES service_categories(id) ON DELETE CASCADE,
    CONSTRAINT uq_vsc          UNIQUE (vendor_profile_id, service_category_id)
) ENGINE=InnoDB;

-- Servicios individuales del proveedor
CREATE TABLE vendor_services (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vendor_profile_id   BIGINT UNSIGNED NOT NULL,
    service_category_id BIGINT UNSIGNED NOT NULL,
    name                VARCHAR(200)    NOT NULL,
    description         TEXT            NULL,
    base_price          DECIMAL(12,2)   NOT NULL,
    max_price           DECIMAL(12,2)   NULL,            -- rango de precios
    currency_code       CHAR(3)         NOT NULL DEFAULT 'MXN',
    price_unit          VARCHAR(50)     NULL,            -- "por evento", "por hora", "por persona"
    min_guests          INT UNSIGNED    NULL,
    max_guests          INT UNSIGNED    NULL,
    delivery_time_days  SMALLINT UNSIGNED NULL,
    is_active           TINYINT(1)      NOT NULL DEFAULT 1,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_vendor_svc_vendor   FOREIGN KEY (vendor_profile_id)   REFERENCES vendor_profiles(id)    ON DELETE CASCADE,
    CONSTRAINT fk_vendor_svc_category FOREIGN KEY (service_category_id) REFERENCES service_categories(id) ON DELETE RESTRICT,
    INDEX idx_vendor_svc_vendor   (vendor_profile_id),
    INDEX idx_vendor_svc_category (service_category_id),
    INDEX idx_vendor_svc_price    (base_price)
) ENGINE=InnoDB;

-- Items del cotizador interactivo (addons/paquetes del servicio)
CREATE TABLE service_pricing_items (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vendor_service_id   BIGINT UNSIGNED NOT NULL,
    name                VARCHAR(200)    NOT NULL,
    description         VARCHAR(500)    NULL,
    price               DECIMAL(12,2)   NOT NULL,
    is_optional         TINYINT(1)      NOT NULL DEFAULT 1,
    sort_order          SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_spi_service FOREIGN KEY (vendor_service_id) REFERENCES vendor_services(id) ON DELETE CASCADE,
    INDEX idx_spi_service (vendor_service_id, sort_order)
) ENGINE=InnoDB;

-- Portafolio / galería del proveedor
CREATE TABLE vendor_portfolio_items (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vendor_profile_id   BIGINT UNSIGNED NOT NULL,
    media_type          ENUM('image','video')    NOT NULL DEFAULT 'image',
    media_url           VARCHAR(500)    NOT NULL,
    thumbnail_url       VARCHAR(500)    NULL,
    title               VARCHAR(200)    NULL,
    description         VARCHAR(500)    NULL,
    sort_order          SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vpi_vendor FOREIGN KEY (vendor_profile_id) REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    INDEX idx_vpi_vendor (vendor_profile_id, sort_order)
) ENGINE=InnoDB;

-- Reviews de proveedores (un couple_profile por boda/proveedor)
CREATE TABLE vendor_reviews (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vendor_profile_id   BIGINT UNSIGNED NOT NULL,
    couple_profile_id   BIGINT UNSIGNED NOT NULL,
    wedding_id          BIGINT UNSIGNED NOT NULL,
    rating              TINYINT UNSIGNED NOT NULL,
    title               VARCHAR(200)    NULL,
    comment             TEXT            NULL,
    vendor_response     TEXT            NULL,
    vendor_responded_at DATETIME        NULL,
    is_verified         TINYINT(1)      NOT NULL DEFAULT 0,  -- verificada si contrató vía plataforma
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_vr_vendor FOREIGN KEY (vendor_profile_id) REFERENCES vendor_profiles(id)  ON DELETE CASCADE,
    CONSTRAINT fk_vr_couple FOREIGN KEY (couple_profile_id) REFERENCES couple_profiles(id)  ON DELETE CASCADE,
    CONSTRAINT fk_vr_wedding FOREIGN KEY (wedding_id)       REFERENCES weddings(id)         ON DELETE CASCADE,
    CONSTRAINT chk_vr_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT uq_vr_unique  UNIQUE (vendor_profile_id, wedding_id),  -- una review por boda por proveedor
    INDEX idx_vr_rating (vendor_profile_id, rating)
) ENGINE=InnoDB;

-- ============================================================================
-- MÓDULO 6: QUOTING & BOOKING
-- Responsabilidad: Cotizaciones, citas, contrataciones
-- ============================================================================

CREATE TABLE quotes (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                CHAR(36)        NOT NULL,
    wedding_id          BIGINT UNSIGNED NOT NULL,
    vendor_profile_id   BIGINT UNSIGNED NOT NULL,            -- proveedor al que se solicita
    vendor_service_id   BIGINT UNSIGNED NULL,                -- servicio específico (opcional)
    requested_by_id     BIGINT UNSIGNED NOT NULL,          -- couple_profile
    status              ENUM('draft','sent','viewed','accepted','rejected','expired')
                                        NOT NULL DEFAULT 'draft',
    event_date          DATE            NULL,
    guest_count         INT UNSIGNED    NULL,
    custom_requirements TEXT            NULL,
    subtotal            DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
    discount_amount     DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
    tax_amount          DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
    total_amount        DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
    currency_code       CHAR(3)         NOT NULL DEFAULT 'MXN',
    valid_until         DATE            NULL,
    notes               TEXT            NULL,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_quotes_wedding  FOREIGN KEY (wedding_id)       REFERENCES weddings(id)         ON DELETE CASCADE,
    CONSTRAINT fk_quotes_vendor   FOREIGN KEY (vendor_profile_id) REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_quotes_service  FOREIGN KEY (vendor_service_id) REFERENCES vendor_services(id)  ON DELETE SET NULL,
    CONSTRAINT fk_quotes_couple   FOREIGN KEY (requested_by_id)  REFERENCES couple_profiles(id)  ON DELETE CASCADE,
    CONSTRAINT uq_quotes_uuid     UNIQUE (uuid),
    INDEX idx_quotes_wedding (wedding_id),
    INDEX idx_quotes_vendor (vendor_profile_id),
    INDEX idx_quotes_vendor_svc (vendor_service_id),
    INDEX idx_quotes_status (status)
) ENGINE=InnoDB;

-- Items desglosados de cada cotización
CREATE TABLE quote_line_items (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    quote_id        BIGINT UNSIGNED NOT NULL,
    pricing_item_id BIGINT UNSIGNED NULL,                -- referencia al catálogo, o NULL si es custom
    description     VARCHAR(500)    NOT NULL,
    quantity        DECIMAL(10,2)   NOT NULL DEFAULT 1.00,
    unit_price      DECIMAL(12,2)   NOT NULL,
    total_price     DECIMAL(12,2)   NOT NULL,
    sort_order      SMALLINT UNSIGNED NOT NULL DEFAULT 0,

    CONSTRAINT fk_qli_quote   FOREIGN KEY (quote_id)        REFERENCES quotes(id)                ON DELETE CASCADE,
    CONSTRAINT fk_qli_pricing FOREIGN KEY (pricing_item_id)  REFERENCES service_pricing_items(id) ON DELETE SET NULL,
    INDEX idx_qli_quote (quote_id)
) ENGINE=InnoDB;

-- Agendamiento de citas
CREATE TABLE appointments (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                CHAR(36)        NOT NULL,
    wedding_id          BIGINT UNSIGNED NOT NULL,
    vendor_profile_id   BIGINT UNSIGNED NOT NULL,
    couple_profile_id   BIGINT UNSIGNED NOT NULL,
    quote_id            BIGINT UNSIGNED NULL,
    appointment_date    DATE            NOT NULL,
    start_time          TIME            NOT NULL,
    end_time            TIME            NOT NULL,
    meeting_type        ENUM('in_person','video_call','phone') NOT NULL DEFAULT 'video_call',
    meeting_url         VARCHAR(500)    NULL,
    location            VARCHAR(500)    NULL,
    status              ENUM('requested','confirmed','cancelled','completed','no_show')
                                        NOT NULL DEFAULT 'requested',
    notes               TEXT            NULL,
    cancellation_reason VARCHAR(500)    NULL,
    reminder_sent_at    DATETIME        NULL,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_appt_wedding FOREIGN KEY (wedding_id)       REFERENCES weddings(id)         ON DELETE CASCADE,
    CONSTRAINT fk_appt_vendor  FOREIGN KEY (vendor_profile_id) REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_appt_couple  FOREIGN KEY (couple_profile_id) REFERENCES couple_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_appt_quote   FOREIGN KEY (quote_id)          REFERENCES quotes(id)          ON DELETE SET NULL,
    CONSTRAINT uq_appt_uuid    UNIQUE (uuid),
    INDEX idx_appt_vendor_date (vendor_profile_id, appointment_date),
    INDEX idx_appt_wedding     (wedding_id),
    INDEX idx_appt_status      (status)
) ENGINE=InnoDB;

-- Disponibilidad semanal del proveedor
CREATE TABLE vendor_availability (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vendor_profile_id   BIGINT UNSIGNED NOT NULL,
    day_of_week         TINYINT UNSIGNED NOT NULL,         -- 0=Lunes, 6=Domingo
    start_time          TIME            NOT NULL,
    end_time            TIME            NOT NULL,
    is_active           TINYINT(1)      NOT NULL DEFAULT 1,

    CONSTRAINT fk_va_vendor FOREIGN KEY (vendor_profile_id) REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    CONSTRAINT chk_va_day   CHECK (day_of_week BETWEEN 0 AND 6),
    INDEX idx_va_vendor_day (vendor_profile_id, day_of_week)
) ENGINE=InnoDB;

-- Bloqueos de agenda (vacaciones, fechas ocupadas)
CREATE TABLE vendor_blocked_dates (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vendor_profile_id   BIGINT UNSIGNED NOT NULL,
    blocked_date        DATE            NOT NULL,
    reason              VARCHAR(200)    NULL,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vbd_vendor FOREIGN KEY (vendor_profile_id) REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    CONSTRAINT uq_vbd_date   UNIQUE (vendor_profile_id, blocked_date)
) ENGINE=InnoDB;

-- ============================================================================
-- MÓDULO 7: PAYMENTS & BILLING
-- Responsabilidad: Suscripciones, transacciones, comisiones
-- ============================================================================

-- Planes de suscripción (para proveedores y novios premium)
CREATE TABLE subscription_plans (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name                VARCHAR(100)    NOT NULL,
    slug                VARCHAR(100)    NOT NULL,
    target_audience     ENUM('vendor','couple')    NOT NULL,
    description         TEXT            NULL,
    price               DECIMAL(12,2)   NOT NULL,
    currency_code       CHAR(3)         NOT NULL DEFAULT 'MXN',
    billing_period      ENUM('monthly','quarterly','yearly','one_time') NOT NULL,
    features_json       JSON            NOT NULL,          -- {"max_portfolio_items": 50, "priority_listing": true}
    max_listings        INT UNSIGNED    NULL,               -- límite de servicios visibles
    commission_rate     DECIMAL(5,4)    NOT NULL DEFAULT 0.0000,  -- 0.0500 = 5%
    is_active           TINYINT(1)      NOT NULL DEFAULT 1,
    sort_order          SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_sub_plans_slug UNIQUE (slug)
) ENGINE=InnoDB;

-- Suscripciones activas
CREATE TABLE subscriptions (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                CHAR(36)        NOT NULL,
    user_id             BIGINT UNSIGNED NOT NULL,
    plan_id             BIGINT UNSIGNED NOT NULL,
    status              ENUM('active','past_due','cancelled','expired','trialing')
                                        NOT NULL DEFAULT 'active',
    current_period_start DATETIME       NOT NULL,
    current_period_end   DATETIME       NOT NULL,
    trial_ends_at       DATETIME        NULL,
    cancelled_at        DATETIME        NULL,
    cancellation_reason VARCHAR(500)    NULL,
    external_subscription_id VARCHAR(200) NULL,           -- ID del payment gateway
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_subs_user FOREIGN KEY (user_id) REFERENCES users(id)              ON DELETE CASCADE,
    CONSTRAINT fk_subs_plan FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)  ON DELETE RESTRICT,
    CONSTRAINT uq_subs_uuid UNIQUE (uuid),
    INDEX idx_subs_user_status (user_id, status),
    INDEX idx_subs_period_end (current_period_end)
) ENGINE=InnoDB;

-- Transacciones / pagos entre novios y proveedores
CREATE TABLE payments (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                CHAR(36)        NOT NULL,
    wedding_id          BIGINT UNSIGNED NOT NULL,
    vendor_profile_id   BIGINT UNSIGNED NOT NULL,
    quote_id            BIGINT UNSIGNED NULL,
    payer_user_id       BIGINT UNSIGNED NOT NULL,
    payment_type        ENUM('deposit','partial','final','refund') NOT NULL,
    amount              DECIMAL(12,2)   NOT NULL,
    currency_code       CHAR(3)         NOT NULL DEFAULT 'MXN',
    platform_fee        DECIMAL(12,2)   NOT NULL DEFAULT 0.00,     -- comisión de la plataforma
    vendor_payout       DECIMAL(12,2)   NOT NULL DEFAULT 0.00,     -- amount - fee
    status              ENUM('pending','processing','completed','failed','refunded','cancelled')
                                        NOT NULL DEFAULT 'pending',
    payment_method      VARCHAR(50)     NULL,                       -- 'card', 'transfer', 'oxxo'
    external_payment_id VARCHAR(200)    NULL,                       -- ID del payment gateway
    external_payout_id  VARCHAR(200)    NULL,
    paid_at             DATETIME        NULL,
    refunded_at         DATETIME        NULL,
    failure_reason      VARCHAR(500)    NULL,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_pay_wedding FOREIGN KEY (wedding_id)       REFERENCES weddings(id)         ON DELETE RESTRICT,
    CONSTRAINT fk_pay_vendor  FOREIGN KEY (vendor_profile_id) REFERENCES vendor_profiles(id) ON DELETE RESTRICT,
    CONSTRAINT fk_pay_quote   FOREIGN KEY (quote_id)          REFERENCES quotes(id)          ON DELETE SET NULL,
    CONSTRAINT fk_pay_payer   FOREIGN KEY (payer_user_id)     REFERENCES users(id)            ON DELETE RESTRICT,
    CONSTRAINT uq_pay_uuid    UNIQUE (uuid),
    INDEX idx_pay_wedding (wedding_id),
    INDEX idx_pay_vendor  (vendor_profile_id),
    INDEX idx_pay_status  (status),
    INDEX idx_pay_date    (paid_at)
) ENGINE=InnoDB;

-- ============================================================================
-- MÓDULO 8: MESSAGING
-- Responsabilidad: Chat entre novios y proveedores
-- ============================================================================

CREATE TABLE conversations (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                CHAR(36)        NOT NULL,
    wedding_id          BIGINT UNSIGNED NOT NULL,
    vendor_profile_id   BIGINT UNSIGNED NOT NULL,
    couple_profile_id   BIGINT UNSIGNED NOT NULL,
    status              ENUM('active','archived','blocked') NOT NULL DEFAULT 'active',
    last_message_at     DATETIME        NULL,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_conv_wedding FOREIGN KEY (wedding_id)       REFERENCES weddings(id)         ON DELETE CASCADE,
    CONSTRAINT fk_conv_vendor  FOREIGN KEY (vendor_profile_id) REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_conv_couple  FOREIGN KEY (couple_profile_id) REFERENCES couple_profiles(id) ON DELETE CASCADE,
    CONSTRAINT uq_conv_uuid    UNIQUE (uuid),
    CONSTRAINT uq_conv_pair    UNIQUE (wedding_id, vendor_profile_id),  -- una conversación por pareja-proveedor-boda
    INDEX idx_conv_couple (couple_profile_id, last_message_at DESC),
    INDEX idx_conv_vendor (vendor_profile_id, last_message_at DESC)
) ENGINE=InnoDB;

CREATE TABLE messages (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    conversation_id     BIGINT UNSIGNED NOT NULL,
    sender_user_id      BIGINT UNSIGNED NOT NULL,
    content             TEXT            NOT NULL,
    message_type        ENUM('text','image','file','quote_share') NOT NULL DEFAULT 'text',
    attachment_url      VARCHAR(500)    NULL,
    is_read             TINYINT(1)      NOT NULL DEFAULT 0,
    read_at             DATETIME        NULL,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_msg_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    CONSTRAINT fk_msg_sender       FOREIGN KEY (sender_user_id)  REFERENCES users(id)          ON DELETE CASCADE,
    INDEX idx_msg_conversation_date (conversation_id, created_at DESC),
    INDEX idx_msg_unread (conversation_id, is_read)
) ENGINE=InnoDB;

-- ============================================================================
-- MÓDULO 9: BUDGET MANAGEMENT
-- Responsabilidad: Gestión del presupuesto de la boda
-- ============================================================================

CREATE TABLE budget_categories (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    wedding_id      BIGINT UNSIGNED NOT NULL,
    name            VARCHAR(100)    NOT NULL,             -- "Fotografía", "Catering", "Flores"
    allocated_amount DECIMAL(12,2)  NOT NULL DEFAULT 0.00,
    sort_order      SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_budget_cat_wedding FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE,
    INDEX idx_budget_cat_wedding (wedding_id)
) ENGINE=InnoDB;

CREATE TABLE budget_items (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    budget_category_id  BIGINT UNSIGNED NOT NULL,
    vendor_service_id   BIGINT UNSIGNED NULL,             -- vinculado a servicio contratado
    name                VARCHAR(200)    NOT NULL,
    estimated_cost      DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
    actual_cost         DECIMAL(12,2)   NULL,
    is_paid             TINYINT(1)      NOT NULL DEFAULT 0,
    notes               VARCHAR(500)    NULL,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_bi_category FOREIGN KEY (budget_category_id) REFERENCES budget_categories(id) ON DELETE CASCADE,
    CONSTRAINT fk_bi_service  FOREIGN KEY (vendor_service_id)  REFERENCES vendor_services(id)   ON DELETE SET NULL,
    INDEX idx_bi_category (budget_category_id)
) ENGINE=InnoDB;

-- ============================================================================
-- MÓDULO 10: AI ASSISTANT
-- Responsabilidad: Registro de interacciones con el asistente de IA
-- ============================================================================

CREATE TABLE ai_conversations (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid            CHAR(36)        NOT NULL,
    wedding_id      BIGINT UNSIGNED NOT NULL,
    user_id         BIGINT UNSIGNED NOT NULL,
    title           VARCHAR(200)    NULL,
    context_type    VARCHAR(50)     NOT NULL DEFAULT 'general',  -- 'budget', 'vendor_search', 'planning'
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_ai_conv_wedding FOREIGN KEY (wedding_id) REFERENCES weddings(id) ON DELETE CASCADE,
    CONSTRAINT fk_ai_conv_user    FOREIGN KEY (user_id)    REFERENCES users(id)     ON DELETE CASCADE,
    CONSTRAINT uq_ai_conv_uuid    UNIQUE (uuid),
    INDEX idx_ai_conv_wedding (wedding_id)
) ENGINE=InnoDB;

CREATE TABLE ai_messages (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ai_conversation_id  BIGINT UNSIGNED NOT NULL,
    role                ENUM('user','assistant','system') NOT NULL,
    content             TEXT            NOT NULL,
    tokens_used         INT UNSIGNED    NULL,
    model_version       VARCHAR(50)     NULL,
    metadata_json       JSON            NULL,              -- recomendaciones generadas, etc.
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ai_msg_conv FOREIGN KEY (ai_conversation_id) REFERENCES ai_conversations(id) ON DELETE CASCADE,
    INDEX idx_ai_msg_conv (ai_conversation_id, created_at)
) ENGINE=InnoDB;

-- Recomendaciones generadas por IA (para tracking y analytics)
CREATE TABLE ai_recommendations (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    wedding_id          BIGINT UNSIGNED NOT NULL,
    ai_conversation_id  BIGINT UNSIGNED NULL,
    recommendation_type VARCHAR(50)     NOT NULL,          -- 'vendor', 'budget', 'timeline', 'checklist'
    title               VARCHAR(200)    NOT NULL,
    description         TEXT            NULL,
    entity_type         VARCHAR(50)     NULL,              -- 'vendor_service', 'budget_item', etc.
    entity_id           BIGINT UNSIGNED NULL,
    confidence_score    DECIMAL(5,4)    NULL,              -- 0.0000 a 1.0000
    was_accepted        TINYINT(1)      NULL,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ai_rec_wedding FOREIGN KEY (wedding_id)          REFERENCES weddings(id)          ON DELETE CASCADE,
    CONSTRAINT fk_ai_rec_conv    FOREIGN KEY (ai_conversation_id)  REFERENCES ai_conversations(id)  ON DELETE SET NULL,
    INDEX idx_ai_rec_wedding_type (wedding_id, recommendation_type)
) ENGINE=InnoDB;

-- ============================================================================
-- MÓDULO 11: NOTIFICATIONS
-- Responsabilidad: Notificaciones multi-canal
-- ============================================================================

CREATE TABLE notifications (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT UNSIGNED NOT NULL,
    type                VARCHAR(100)    NOT NULL,           -- 'rsvp_received', 'message_new', 'appointment_reminder'
    title               VARCHAR(200)    NOT NULL,
    body                TEXT            NULL,
    channel             ENUM('in_app','email','whatsapp','push') NOT NULL DEFAULT 'in_app',
    reference_type      VARCHAR(50)     NULL,               -- 'wedding', 'appointment', 'message'
    reference_id        BIGINT UNSIGNED NULL,
    is_read             TINYINT(1)      NOT NULL DEFAULT 0,
    read_at             DATETIME        NULL,
    sent_at             DATETIME        NULL,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notif_user_unread (user_id, is_read, created_at DESC),
    INDEX idx_notif_type (type)
) ENGINE=InnoDB;

-- Preferencias de notificación por usuario
CREATE TABLE notification_preferences (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL,
    event_type  VARCHAR(100)    NOT NULL,
    channel     ENUM('in_app','email','whatsapp','push') NOT NULL,
    is_enabled  TINYINT(1)      NOT NULL DEFAULT 1,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_notif_pref_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_notif_pref      UNIQUE (user_id, event_type, channel)
) ENGINE=InnoDB;

-- ============================================================================
-- MÓDULO 12: AUDIT LOG (Cross-cutting)
-- Responsabilidad: Trazabilidad de acciones críticas
-- ============================================================================

CREATE TABLE audit_logs (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NULL,
    action          VARCHAR(100)    NOT NULL,               -- 'payment.created', 'wedding.updated'
    entity_type     VARCHAR(50)     NOT NULL,
    entity_id       BIGINT UNSIGNED NOT NULL,
    old_values_json JSON            NULL,
    new_values_json JSON            NULL,
    ip_address      VARCHAR(45)     NULL,                   -- IPv4 e IPv6
    user_agent      VARCHAR(500)    NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_user   (user_id, created_at DESC),
    INDEX idx_audit_action (action, created_at DESC)
) ENGINE=InnoDB;

-- ============================================================================
-- DATOS INICIALES (Seed Data)
-- ============================================================================

-- Roles base del sistema
INSERT INTO roles (name, description) VALUES
    ('admin',    'Administrador de la plataforma'),
    ('couple',   'Novio/Novia planificando su boda'),
    ('vendor',   'Proveedor de servicios para bodas'),
    ('guest',    'Invitado a una boda');

-- Categorías de servicio iniciales
INSERT INTO service_categories (name, slug, sort_order) VALUES
    ('Fotografía y Video',    'fotografia-video',    1),
    ('Catering y Banquetes',  'catering-banquetes',  2),
    ('Floristería',           'floristeria',         3),
    ('Música y DJ',           'musica-dj',           4),
    ('Vestidos y Trajes',     'vestidos-trajes',     5),
    ('Decoración',            'decoracion',          6),
    ('Salones y Jardines',    'salones-jardines',    7),
    ('Pastelería',            'pasteleria',          8),
    ('Invitaciones',          'invitaciones',        9),
    ('Transporte',            'transporte',          10),
    ('Maquillaje y Peinado',  'maquillaje-peinado',  11),
    ('Coordinación de Bodas', 'coordinacion-bodas',  12),
    ('Joyería',               'joyeria',             13),
    ('Luna de Miel',          'luna-de-miel',        14);

-- Planes de suscripción iniciales
INSERT INTO subscription_plans (name, slug, target_audience, price, billing_period, commission_rate, features_json, sort_order) VALUES
    ('Novios Free',        'couple-free',      'couple',  0.00,    'one_time',  0.0000, '{"invitations": true, "website": true, "rsvp": true, "ai_basic": true}', 1),
    ('Novios Premium',     'couple-premium',   'couple',  999.00,  'one_time',  0.0000, '{"invitations": true, "website": true, "rsvp": true, "ai_advanced": true, "budget_management": true, "analytics": true}', 2),
    ('Proveedor Básico',   'vendor-basic',     'vendor',  499.00,  'monthly',   0.0500, '{"max_portfolio_items": 10, "max_services": 5, "chat": true}', 3),
    ('Proveedor Pro',      'vendor-pro',       'vendor',  999.00,  'monthly',   0.0350, '{"max_portfolio_items": 50, "max_services": 20, "chat": true, "priority_listing": true, "analytics": true}', 4),
    ('Proveedor Enterprise','vendor-enterprise','vendor', 2499.00, 'monthly',   0.0200, '{"max_portfolio_items": -1, "max_services": -1, "chat": true, "priority_listing": true, "featured": true, "analytics": true, "api_access": true}', 5);
