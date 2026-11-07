(function(){
 const c=window.VWS_CONFIG||{};
 if(!window.supabase||!c.supabaseUrl||!c.supabasePublishableKey){window.vwsSupabase=null;return;}
 window.vwsSupabase=window.supabase.createClient(c.supabaseUrl,c.supabasePublishableKey);
})();
