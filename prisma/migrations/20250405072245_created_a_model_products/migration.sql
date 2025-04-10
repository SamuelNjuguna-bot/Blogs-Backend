-- CreateTable
CREATE TABLE "products" (
    "productID" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "remaining_products" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isOnOffer" BOOLEAN NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("productID")
);
