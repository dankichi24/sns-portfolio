/**
 * Supabaseクライアントインスタンスを生成・エクスポートするモジュール
 *
 * @module lib/supabase
 * @description
 * 環境変数（SUPABASE_URL, SUPABASE_SERVICE_KEY）を使用して
 * Supabaseのサービスクライアントを初期化し、全体で利用できるようにエクスポートする。
 */

const { createClient } = require("@supabase/supabase-js");

require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = supabase;
