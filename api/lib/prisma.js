/**
 * Prismaクライアントのインスタンスを生成・エクスポートするモジュール
 *
 * @module lib/prisma
 * @description
 * 開発環境ではHot Reload対策のためグローバル変数を利用して
 * PrismaClientの複数インスタンス生成を防止。
 * 本番環境では通常通り新規インスタンスを作成する。
 */

const { PrismaClient } = require("@prisma/client");

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = prisma;
