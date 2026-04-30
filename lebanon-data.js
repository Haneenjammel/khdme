export const CITIES = [
  { key: 'all',          label: 'All Cities' },
  // Greater Beirut
  { key: 'beirut',       label: 'Beirut' },
  { key: 'jounieh',      label: 'Jounieh' },
  { key: 'broummana',    label: 'Broummana' },
  { key: 'beit_mery',    label: 'Beit Mery' },
  { key: 'metn',         label: 'Metn' },
  { key: 'aley',         label: 'Aley' },
  { key: 'chouf',        label: 'Chouf' },
  // North Lebanon
  { key: 'tripoli',      label: 'Tripoli' },
  { key: 'byblos',       label: 'Byblos (Jbeil)' },
  { key: 'jbeil',        label: 'Jbeil' },
  { key: 'batroun',      label: 'Batroun' },
  { key: 'bcharre',      label: 'Bcharre' },
  { key: 'ehden',        label: 'Ehden' },
  { key: 'zgharta',      label: 'Zgharta' },
  { key: 'koura',        label: 'Koura' },
  { key: 'minieh',       label: 'Minieh' },
  { key: 'halba',        label: 'Halba' },
  { key: 'akkar',        label: 'Akkar' },
  { key: 'douma',        label: 'Douma' },
  // South Lebanon
  { key: 'sidon',        label: 'Sidon (Saida)' },
  { key: 'tyre',         label: 'Tyre (Sour)' },
  { key: 'nabatieh',     label: 'Nabatieh' },
  { key: 'jezzine',      label: 'Jezzine' },
  { key: 'marjeyoun',    label: 'Marjeyoun' },
  { key: 'hasbaya',      label: 'Hasbaya' },
  { key: 'khiam',        label: 'Khiam' },
  { key: 'bent_jbeil',   label: 'Bent Jbeil' },
  // Bekaa Valley
  { key: 'zahle',        label: 'Zahle' },
  { key: 'baalbek',      label: 'Baalbek' },
  { key: 'hermel',       label: 'Hermel' },
  { key: 'west_bekaa',   label: 'West Bekaa' },
  { key: 'rashaya',      label: 'Rashaya' },
  { key: 'deir_el_ahmar',label: 'Deir el Ahmar' },
  { key: 'yohmor',       label: 'Yohmor' },
  { key: 'aanjar',       label: 'Aanjar' },
  { key: 'other',        label: 'Other' },
];

export const CITY_LABELS = Object.fromEntries(
  CITIES.filter(c => c.key !== 'all').map(c => [c.key, c.label])
);

export const CATEGORIES = [
  { key: 'all',           icon: '🌟', label: 'All' },
  { key: 'cleaning',      icon: '🧹', label: 'Cleaning' },
  { key: 'tutoring',      icon: '📚', label: 'Tutoring' },
  { key: 'repair',        icon: '🔧', label: 'Repair' },
  { key: 'design',        icon: '🎨', label: 'Design' },
  { key: 'delivery',      icon: '🚚', label: 'Delivery' },
  { key: 'cooking',       icon: '🍳', label: 'Cooking' },
  { key: 'photography',   icon: '📷', label: 'Photography' },
  { key: 'tech_support',  icon: '💻', label: 'Tech Support' },
  { key: 'beauty',        icon: '💅', label: 'Beauty' },
  { key: 'other',         icon: '⭐', label: 'Other' },
];

export const CATEGORY_ICONS  = Object.fromEntries(CATEGORIES.filter(c => c.key !== 'all').map(c => [c.key, c.icon]));
export const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.filter(c => c.key !== 'all').map(c => [c.key, c.label]));
