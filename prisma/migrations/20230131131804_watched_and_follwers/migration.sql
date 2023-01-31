-- CreateTable
CREATE TABLE "watchedMovies" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "movieid" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdat" DATE DEFAULT CURRENT_TIMESTAMP,
    "updatedat" DATE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "watchedMovies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "following" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "movieid" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdat" DATE DEFAULT CURRENT_TIMESTAMP,
    "updatedat" DATE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "following_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "watchedMovies" ADD CONSTRAINT "watchedMovies_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "watchedMovies" ADD CONSTRAINT "watchedMovies_movieid_fkey" FOREIGN KEY ("movieid") REFERENCES "movies"("movieid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "following_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "following" ADD CONSTRAINT "following_movieid_fkey" FOREIGN KEY ("movieid") REFERENCES "movies"("movieid") ON DELETE RESTRICT ON UPDATE CASCADE;
