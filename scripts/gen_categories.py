import json

with open(r'd:\Projects\Web-Apps\Devs_Recipe\lib\public-apis-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()
data = json.loads(content.replace('export const PUBLIC_APIS = ', '').strip(';'))
categories = set([item['category'] for item in data])

mapping = {
    'Animals': ('PawPrint', 'Other'),
    'Anime': ('Tv', 'Media & Design'),
    'Anti-Malware': ('Shield', 'Tools & Utils'),
    'Art & Design': ('Palette', 'Media & Design'),
    'Authentication & Authorization': ('Key', 'Tools & Utils'),
    'Blockchain': ('Link', 'Other'),
    'Books': ('Book', 'Data & Info'),
    'Business': ('Briefcase', 'Business & Finance'),
    'Calendar': ('Calendar', 'Tools & Utils'),
    'Cloud Storage & File Sharing': ('Cloud', 'Technology & Dev'),
    'Continuous Integration': ('RefreshCw', 'Technology & Dev'),
    'Cryptocurrency': ('Bitcoin', 'Business & Finance'),
    'Currency Exchange': ('DollarSign', 'Business & Finance'),
    'Data Validation': ('CheckCircle', 'Tools & Utils'),
    'Development': ('Code', 'Technology & Dev'),
    'Dictionaries': ('BookOpen', 'Data & Info'),
    'Documents & Productivity': ('FileText', 'Data & Info'),
    'Email': ('Mail', 'Tools & Utils'),
    'Entertainment': ('Film', 'Media & Design'),
    'Environment': ('Leaf', 'Data & Info'),
    'Events': ('CalendarDays', 'Other'),
    'Finance': ('TrendingUp', 'Business & Finance'),
    'Food & Drink': ('Coffee', 'Other'),
    'Games & Comics': ('Gamepad2', 'Media & Design'),
    'Geocoding': ('MapPin', 'Tools & Utils'),
    'Government': ('Landmark', 'Other'),
    'Health': ('Heart', 'Other'),
    'Jobs': ('Users', 'Business & Finance'),
    'Machine Learning': ('Brain', 'Technology & Dev'),
    'Music': ('Music', 'Media & Design'),
    'News': ('Newspaper', 'Data & Info'),
    'Open Data': ('Database', 'Data & Info'),
    'Open Source Projects': ('Github', 'Technology & Dev'),
    'Patent': ('FileBadge', 'Data & Info'),
    'Personality': ('User', 'Data & Info'),
    'Phone': ('Phone', 'Tools & Utils'),
    'Photography': ('Camera', 'Media & Design'),
    'Programming': ('Terminal', 'Technology & Dev'),
    'Science & Math': ('FlaskConical', 'Data & Info'),
    'Security': ('Lock', 'Technology & Dev'),
    'Shopping': ('ShoppingCart', 'Business & Finance'),
    'Social': ('Share2', 'Other'),
    'Sports & Fitness': ('Activity', 'Other'),
    'Test Data': ('TestTube', 'Technology & Dev'),
    'Text Analysis': ('Search', 'Technology & Dev'),
    'Tracking': ('Navigation', 'Tools & Utils'),
    'Transportation': ('Car', 'Tools & Utils'),
    'URL Shorteners': ('Link2', 'Tools & Utils'),
    'Vehicle': ('Truck', 'Tools & Utils'),
    'Video': ('Video', 'Media & Design'),
    'Weather': ('CloudSun', 'Data & Info')
}

icons_to_import = set(['Bookmark', 'Package'])
for k, v in mapping.items():
    if k in categories:
        icons_to_import.add(v[0])

import_str = 'import {\n  ' + ',\n  '.join(sorted(list(icons_to_import))) + '\n} from "lucide-react";\nimport React from "react";\n\n'

export_str = 'export const API_CATEGORIES = [\n'
export_str += '  { id: "favs", label: "Favorites", icon: <Bookmark className="w-4 h-4" />, section: "personal" },\n'

for k in sorted(list(categories)):
    if k in mapping:
        icon, section = mapping[k]
        id_str = k.lower().replace(' & ', '_').replace(' ', '_').replace('-', '_')
        export_str += f'  {{ id: "{id_str}", label: "{k}", icon: <{icon} className="w-4 h-4" />, section: "{section}" }},\n'

export_str += '  { id: "all", label: "All APIs", icon: <Package className="w-4 h-4" />, section: "browse" }\n];\n'

with open(r'd:\Projects\Web-Apps\Devs_Recipe\lib\public-apis-categories.tsx', 'w', encoding='utf-8') as f:
    f.write(import_str + export_str)

print('Successfully created public-apis-categories.tsx')
