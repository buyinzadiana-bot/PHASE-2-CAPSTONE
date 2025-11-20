// import { createClient } from '@supabase/supabase-js'

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY! // server key bypasses RLS
// )

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { id, email, username, full_name } = req.body

//     const { data, error } = await supabase
//       .from('users')
//       .insert([{ id, email, username, full_name }])

//     if (error) return res.status(400).json({ error })
//     return res.status(200).json(data)
//   }

//   res.status(405).end()
// }
