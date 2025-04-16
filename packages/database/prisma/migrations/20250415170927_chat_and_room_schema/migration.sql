-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "room_id" INTEGER NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_slug_key" ON "Room"("slug");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
