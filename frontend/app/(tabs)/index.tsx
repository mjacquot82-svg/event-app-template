// UPDATED WITH COUNTDOWN + TODAY + LOGO SUPPORT
// (trimmed for brevity — core additions only)

// Add near top inside component:
const days = Math.max(0, Math.ceil((new Date('2026-07-30').getTime() - new Date().getTime()) / (1000*60*60*24)));

// Then inside ScrollView (add at top):
<View style={{alignItems:'center', marginTop:10}}>
  <Text style={{color:'#74D65E', fontWeight:'900'}}>⏳ {days} Days Until Homecoming</Text>
</View>

<View style={{margin:16, padding:14, borderRadius:16, backgroundColor:'#111'}}>
  <Text style={{color:'#fff', fontWeight:'900'}}>Happening Today</Text>
  <Text style={{color:'#ccc'}}>• 10:30 AM — Parade</Text>
  <Text style={{color:'#ccc'}}>• 1:00 PM — Market</Text>
  <Text style={{color:'#ccc'}}>• 9:00 PM — Remix Party</Text>
</View>

// Update SponsorCard:
{sponsor.logo ? (
  <Image source={{ uri: sponsor.logo }} style={{width:40,height:40,marginRight:10}} />
) : (
  <View style={[styles.sponsorBadge, { backgroundColor: sponsor.color }]}>
    <Text style={styles.sponsorBadgeText}>{sponsor.tier.toUpperCase()}</Text>
  </View>
)}
