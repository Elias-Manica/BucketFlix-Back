-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "movieid" INTEGER NOT NULL,
    "comment" VARCHAR(250) NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdat" DATE DEFAULT CURRENT_TIMESTAMP,
    "updatedat" DATE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listmovies" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "movieid" INTEGER NOT NULL,
    "createdat" DATE DEFAULT CURRENT_TIMESTAMP,
    "updatedat" DATE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "listmovies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movies" (
    "id" SERIAL NOT NULL,
    "movieid" INTEGER NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdat" DATE DEFAULT CURRENT_TIMESTAMP,
    "updatedat" DATE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "createdat" DATE DEFAULT CURRENT_TIMESTAMP,
    "updatedat" DATE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "movies_movieid_key" ON "movies"("movieid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_movieid_fkey" FOREIGN KEY ("movieid") REFERENCES "movies"("movieid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listmovies" ADD CONSTRAINT "listmovies_movieid_fkey" FOREIGN KEY ("movieid") REFERENCES "movies"("movieid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "listmovies" ADD CONSTRAINT "listmovies_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
