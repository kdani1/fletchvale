export type BowId = 'willow' | 'oak' | 'maple' | 'crystal' | 'sun' | 'dragon'

export interface BowDef {
  id: BowId
  name: string
  tag: string
  blurb: string
  price: number
  preview: number
  dots: number
  power: number
  wood: string
  accent: string
  glow: string
}

export const BOWS: BowDef[] = [
  {
    id: 'willow',
    name: 'Fűzfa íj',
    tag: 'Kezdő',
    blurb: 'Könnyű és barátságos. Csak egy pici irányt mutat, a többit neked kell érezni.',
    price: 0,
    preview: 72,
    dots: 3,
    power: 1,
    wood: '#c4a574',
    accent: '#7cb342',
    glow: '#dcedc8',
  },
  {
    id: 'oak',
    name: 'Tölgy íj',
    tag: 'Erős fa',
    blurb: 'Kicsit messzebb látod a nyíl útját, és határozottabban repül.',
    price: 40,
    preview: 140,
    dots: 5,
    power: 1.08,
    wood: '#8d6e4c',
    accent: '#5d4037',
    glow: '#ffe0b2',
  },
  {
    id: 'maple',
    name: 'Juhar íj',
    tag: 'Fürge',
    blurb: 'Szép ívelt röppálya-csík. Könnyebb eltalálni a mozgó célpontokat.',
    price: 110,
    preview: 220,
    dots: 8,
    power: 1.16,
    wood: '#d84315',
    accent: '#ff8a65',
    glow: '#ffccbc',
  },
  {
    id: 'crystal',
    name: 'Kristály íj',
    tag: 'Csillogó',
    blurb: 'Hosszú, tiszta előnézet. A kristály fénye mutatja, merre kanyarodik a nyíl.',
    price: 260,
    preview: 320,
    dots: 11,
    power: 1.28,
    wood: '#7e57c2',
    accent: '#80deea',
    glow: '#e1bee7',
  },
  {
    id: 'sun',
    name: 'Napfény íj',
    tag: 'Ragyogó',
    blurb: 'Majdnem a földig látod a pályát. Meleg arany ragyogás kíséri a lövést.',
    price: 560,
    preview: 440,
    dots: 15,
    power: 1.4,
    wood: '#f9a825',
    accent: '#fff59d',
    glow: '#fff8e1',
  },
  {
    id: 'dragon',
    name: 'Sárkány íj',
    tag: 'Legendás',
    blurb: 'Teljes röppálya, extra erő. A völgy ősi íja — ha elég érmét gyűjtöttél.',
    price: 1100,
    preview: 820,
    dots: 20,
    power: 1.55,
    wood: '#c62828',
    accent: '#ff7043',
    glow: '#ffcdd2',
  },
]

export function bowById(id: string): BowDef {
  return BOWS.find((b) => b.id === id) ?? BOWS[0]!
}

export function previewLabel(bow: BowDef): string {
  if (bow.preview < 100) return 'Pici'
  if (bow.preview < 180) return 'Rövid'
  if (bow.preview < 280) return 'Közepes'
  if (bow.preview < 400) return 'Hosszú'
  if (bow.preview < 700) return 'Nagyon hosszú'
  return 'Teljes'
}
