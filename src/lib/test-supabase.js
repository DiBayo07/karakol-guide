import { supabase } from './supabase.js';

async function test() {
  const { data: sights, error: sightsError } = await supabase.from('sights').select('*');
  console.log('sights error:', sightsError);
  console.log('sights data length:', sights?.length);
  if (sights && sights.length > 0) {
    console.log('sights keys:', Object.keys(sights[0]));
    console.log('sights sample:', sights[0]);
  }

  const { data: routes, error: routesError } = await supabase.from('routes').select('*');
  console.log('routes error:', routesError);
  console.log('routes data length:', routes?.length);
  if (routes && routes.length > 0) {
    console.log('routes keys:', Object.keys(routes[0]));
    console.log('routes sample:', routes[0]);
  }

  const { data: food, error: foodError } = await supabase.from('food').select('*');
  console.log('food error:', foodError);
  console.log('food data length:', food?.length);
  if (food && food.length > 0) {
    console.log('food keys:', Object.keys(food[0]));
    console.log('food sample:', food[0]);
  }
}

test().catch(console.error);
