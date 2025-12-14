-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepositoryClient" (
    "id" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "RepositoryClient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RepositoryClient_repositoryId_clientId_key" ON "RepositoryClient"("repositoryId", "clientId");

-- AddForeignKey
ALTER TABLE "RepositoryClient" ADD CONSTRAINT "RepositoryClient_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepositoryClient" ADD CONSTRAINT "RepositoryClient_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
