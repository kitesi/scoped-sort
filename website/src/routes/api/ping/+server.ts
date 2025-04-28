import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import crypto from 'crypto';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Hash IP using SHA256
function hashIp(ip: string): string {
	return crypto.createHash('sha256').update(ip).digest('hex');
}

export async function POST({ request, getClientAddress }) {
	try {
		const { version } = await request.json();

		// Get the client IP (SvelteKit automatically gives you this helper)
		console.log(getClientAddress());
		const ip = hashIp(getClientAddress());

		const { error } = await supabase.from('scoped_sort_pings').insert([
			{
				version: version || null,
				ip,
				timestamp: new Date().toISOString()
			}
		]);

		if (error) {
			console.error('Supabase Insert Error:', error);
			return json({ error: 'Failed to log ping' }, { status: 500 });
		}

		return json({ message: 'Ping logged successfully' }, { status: 200 });
	} catch (err) {
		console.error('Ping handler error:', err);
		return json({ error: 'Server error' }, { status: 500 });
	}
}
