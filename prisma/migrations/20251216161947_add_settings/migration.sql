-- CreateTable
CREATE TABLE "store_settings" (
    "id" SERIAL NOT NULL,
    "store_name" TEXT NOT NULL DEFAULT 'Ateliê Aflorar',
    "logo_url" TEXT,
    "telefone" TEXT,
    "whatsapp" TEXT,
    "descricao" TEXT,
    "endereco" TEXT,
    "is_open" BOOLEAN NOT NULL DEFAULT true,
    "open_time" TEXT NOT NULL DEFAULT '08:00',
    "close_time" TEXT NOT NULL DEFAULT '18:00',
    "work_days" TEXT[] DEFAULT ARRAY['seg', 'ter', 'qua', 'qui', 'sex']::TEXT[],
    "prep_time" TEXT NOT NULL DEFAULT '2-3 dias',
    "accept_orders" BOOLEAN NOT NULL DEFAULT true,
    "accept_pix" BOOLEAN NOT NULL DEFAULT true,
    "pix_key" TEXT,
    "pix_key_type" TEXT,
    "accept_card" BOOLEAN NOT NULL DEFAULT true,
    "accept_cash" BOOLEAN NOT NULL DEFAULT true,
    "delivery_fee_type" TEXT NOT NULL DEFAULT 'fixa',
    "fixed_fee" DECIMAL(10,2) NOT NULL DEFAULT 10.00,
    "free_shipping_at" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "pickup_available" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_neighborhoods" (
    "id" SERIAL NOT NULL,
    "settings_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "taxa" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "delivery_neighborhoods_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "delivery_neighborhoods" ADD CONSTRAINT "delivery_neighborhoods_settings_id_fkey" FOREIGN KEY ("settings_id") REFERENCES "store_settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
