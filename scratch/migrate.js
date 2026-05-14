import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://dlyiypmewsqxedwswqsh.supabase.co',
  'sbp_4fa7e04d64552b9c6fbfff8d56491a3977c851bc'
)

async function run() {
  const { data, error } = await supabase.rpc('execute_sql', {
    sql: `
      ALTER TABLE attendance DROP COLUMN attended;
      ALTER TABLE attendance ADD COLUMN status TEXT DEFAULT 'absent' CHECK (status IN ('assisted', 'absent', 'justified'));
    `
  })
  console.log({ data, error })
}

run()
