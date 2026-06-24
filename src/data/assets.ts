import { MemeItem, StickerItem } from '../types';

export const BASE_MEMES: MemeItem[] = [
  {
    id: 'base-lion',
    title: 'Check the Pride Time',
    description: 'When the pride meeting is at 9 AM and you have to get through Nairobi traffic.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZaRQk2q7s-bE059OhJJJMh0ugNEEEEXiQNZj1FBf3ylKNw1g72BGGgldjTWMfBpPo2ET_6LqsMjZibRsvNDCn6ie55KPTQzHbCg8MYlvv0WmnPCGbHd_RleYOcd0IuegDX9cm8jXs8EIPZOyAXdJWooqu4SZhBImQo89wYAyjYx0Aq69zxBe-Myson_FqL9Wfc68P33ojWcWV6zm6fqjmz1Hasll7EgbTxG3yaZxXtvIYE1qI4vNGPHmnnVGA8LKk_Se1sbNGcb85',
    tags: ['#CorporateJungle', '#NairobiNight'],
    likes: 1240,
    category: 'Corporate'
  },
  {
    id: 'base-danfo',
    title: 'Lagos Commute 2077',
    description: 'Flying Danfo buses weaving through Lagos skyscrapers lined with holographic Kente lines.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxD6Z7ZvhlnUWfs8PfkwiqADB5l32dr_m8isf34VtCYkaMGkZsj76ieaWH8li4seQXYSusFXNiwfSULk12Eq3eR1r3wK4qce7I0aRo8Kz2MH1Ahh3yrbmFJJKFuxiSNgcjFkEw-7a0smgCDRj8ftLlkkAMXAuJlZgSUkMvU20A-EBJnw7ihhUntd0K7tUOSHXGZ2hEPeJxj73pivnVB1OPRMy0iak2tYEOAJpV9GDmtP41h1x7eDcCyC4hlmeknNeccM2Dyy172U0W',
    tags: ['#CyberLagos', '#NaijaNoDeyCarryLast'],
    likes: 3102,
    category: 'Sci-Fi'
  },
  {
    id: 'base-grandma',
    title: 'Grandma Discovering Metaverse',
    description: 'Joyful elderly Ghanaian grandmother experiencing a high-tech VR world.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLwsYPUKf6N7JHhECfTbdMUhunHeA1Qj84DUOsXlI3gu7243zPEZjEVSz-ZXrpH_U1mKvcIlOXfXtNuRVvMAXNcaWHrEHcLGxNo2GUvzKQ2SlywfQ04ITL1kCgyf9G46FTg_O-FF7QBJPXl7FZN6bktGyPRRCJymQgkSsUjcnnweQIyTzrqlCRx0Plrii6rrQibtcPVr-ezG_zF3-1thWMEzUJTgr2irKbkrldCLRPrYVgHmw-8_EqxCe4FQL70w3FpiYVQk7DJxgl',
    tags: ['#DigitalAncestry', '#AuntieVibes'],
    likes: 2400,
    category: 'Lifestyle'
  },
  {
    id: 'base-baobab',
    title: 'Rooted in the Cloud',
    description: 'A glowing golden Baobab tree with fiber-optic roots pulsing with life.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXrk1-6rSpWB0KCgt9UHOMamKqjMd393J3BzRccU4ZL0RoWHR7TnwTYgFhRGj0VTfUvjm5AYiJkrt_Z6Iv3ixusBN3vPxqLn9JYGLuhrRisVnusWy6FEIUAZB0iXWqLzDw6Nb3JcnnCZt2seRGkaKFAPndEmpJJ-7AmuKQKHVMRzmEE-gOAmTWeQCuGOVaY7K6IF0dximeOOt983EbF7UnZ-1SsKs08b9G4DBBAKrh1lP5oi8-C4BhvZ_CjGH8sSLDh191lC-BSUED',
    tags: ['#TechNature', '#ModernAfrica'],
    likes: 1890,
    category: 'Nature-Tech'
  },
  {
    id: 'base-robot-kente',
    title: 'When the AI Hits Just Right',
    description: 'An battle-hardened cybernetic intelligence reflecting inside a rich handwoven Kente cloak.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5bF8Q2ZfD04TicGAMqiDULJcJcouLMoS8-3bsshGs7ymvK-HiBZLz-kaYtyxV6ll3pzkyovxP4-4vHrDDy7uTJ2FjQacERkinjL6gl9DgNCBwemXza5e8u229pCE72x742Qdhh2kSBIJq0yFAwEg-KC_wo1Ci-qFBP9oyH-ssFVIjpoDjMhqgI2wTscapVpxpdRgXCUzNiHr322UP4L_0CtVeRhnVX63ZBK_1VmpEphbfluPLijLrLXi1MO04WcF0WXlCTZkeiahb',
    tags: ['#AfroFuturism', '#DeepVibes'],
    likes: 2750,
    category: 'Afro-Futurism'
  }
];

export const STICKERS: StickerItem[] = [
  {
    id: 'sticker-crown',
    name: 'Royal Beaded Crown',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMHgE7BPPyJE36be7OKHozlvtqyJMe8l7NYI_-ovVXlVL-I8bw5T518Tpfmodaz5nHnta1t7w1Ca-slY6rN1Pn5pqZQ5fn_gVAT13MPFTJ-x0NsgCE3EBi1KlXZjuRtSpEsocDiYSu2XFMveB5FYAOeNXTQE36BevFvOfUiwWSEa0fSa1n5mYDGWrFikz0fj4rU7SOnW8JxTvp2LL29R7Q3fbNdux_b67o5mPFXqLr-Ff0WEflyZkst9sXUqRPzSzAPxY9wECP1j9z',
    category: 'STICKERS'
  },
  {
    id: 'sticker-leopard',
    name: 'Zulu Leopard Hat',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXW_qK-1QppsmpWdGM_HPPVDI3vb4yjAkgK0JGCpmFIv1OrkPGrcyQnw4IjTNzlRRrZ17-YpGxD29cS72dnl6CfmpITFKr6bvZIFDLW1ttzwsM6YlfExutkve0SancQoGbiYM64ccC1xt_4QSaD0pB4FoiqXSxb5pA-HvKdod2NiMCym4UgAdb60UJdwcOei3d7Aw4xWnz9g2TbyhZMKGOuNQ5O9mgsvzsp33L6VCh-tjlg9Z9unrqBsscLZuZTHy9MzUr_zLO1mUw',
    category: 'STICKERS'
  },
  {
    id: 'sticker-gold-neck',
    name: 'Polished Gold Torques',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-SS3JhShwrnUra6t5OtV-6oyRY-uAR-KS0EIL3IWHAgPsdAB3hd6Jfc9XJLCMS8DsQ15OSaxWU6jH6GcvmA2--XYn9gjl2yr11MnRayqGnQ_IqhcS45uZgUrbCR_IMQ2NrFovoROKqjSNpQh0gaZKSLJn_Q9hlIlLrhTG29aIaPjg42KsdOX9NVob_8p2b_G2sdt-TG7xeHSyhKYWgmDNSmfMbnckQ2fSw4P4oKJ7IJovNORjGYXUWMueR2_C6_YOSVn6v5hdoaUg',
    category: 'STICKERS'
  },
  {
    id: 'sticker-chicago-neon',
    name: 'Neon Cyber Mohawk',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG73eNEL02f8mt7h3PEtF-nSYlgxbJY6_PT5Zbqo9CNERZO0G0GqpsDuYQyfDSDlDrTid7zv7jmkg_GMWiP4dadU_hw6FxZnu0PScrzlLwDon1gWJcL0kApKzaMETSQCn2zEbYdCHX2aFwc2RopmDMUrNZNHqAt5dizfQsiTPIY94DHTiNSQmYp2kQ-1gTOu2qtQfJmX4jwAWeWiFRR2npk90WOIz0MWwzVBKXcTWvRcY1VJ2uSJcXyxZF6K5nIy-yO4oNHOxdWz7R',
    category: '3D OBJECTS'
  },
  {
    id: 'sticker-shades',
    name: 'Sunset Benin Sun-visor',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDV2W5EmZUJMBAHX2Hn92VdFiL_zgXcVP2StC0-6VdJjiBuN0fZovPNzRi_iWrNerHfNz49CWhhKvwH3P8YdH71MDgp9gFukLFrakwF04U--ofDEL-KrBwX7ikhPWHmJlen2sxX4UL1JwN1vBIosspSz5fP9__4s-vvkxSwE-aHlJCeSFW1Zvl75HbrGbkDj9tAAbMeMpFAoxSTs33aPNLUH_4urjjN30IvxLC7dXKNJP70tuYfLjBq250g8IsEVLjPSEQ1HFZYKz5I',
    category: 'STICKERS'
  },
  {
    id: 'sticker-gold-lion',
    name: 'Royal Lion Medal',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBe2PV2xAnnebu4kNIzWseA-qsqSco3lLI9i3x3VtmKaTBapVyC6B_acOx2CV5uIiOqjpHotDG0pEWDLRAqIVRauAiqw3xejkymJ05ZMr-3L9x7iAWJbsMx4KtNJiQK3KFVr-HAMFF-4obNWA5FCo6alD7cxz3FnZNAY4n_NdUeW77kaiHqy1EROlBf3tovqk0a3tT7vdsgj7a-FsnlO7QjIH556rDSPwhi66Z5UeCCO_nObTlQGhNE7rAZucP-eLI8-TZ3OGuJIrEm',
    category: '3D OBJECTS'
  }
];

export const OTHER_SUGGESTED_MEMES = [
  {
    title: 'The "Eweee" Reaction',
    caption: 'When the WhatsApp group chat goes completely silent after a major truth reveal.',
    tag: '#NaijaNoDeyCarryLast',
    description: 'Perfect for expressing intense shock or visual pause in Nigeria/West Africa.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpFUmL9pHouHx8uBlExwoCyfCKSNU5Gi-ix3XEjNPr4mnsHxLpmkYhru_7SWYpeCrmSma0VSvOkM9Ie7SxivSWcv3SM_199ZvW5251WfcYPdxrKZYiQUoVkL18tbHf4rl4VRrJ3pSNC8ArKetfquhfP3Qn0w7oz6lfNvGvWFAeFMXSl2GbHxu9nRT7RS0MF0I-2XTBgooANeczLHT9XsWFPaSA3SEdhDT8KxtPhMN8leSjaNoxeXeRlZl2NggHMoatLiOZdNseOQ8H'
  },
  {
    title: 'The Auntie Side-Eye',
    caption: 'For those "I told you so but you wanted to do your own" moments.',
    tag: '#AuntieVibes',
    description: 'Capturing the world-famous side-eye glance of a wise, beautiful Auntie checking her glasses.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_Z6P7rbprgPhhBj56Rws4vPQvqyVmh5mOAFe2Yy-Nx9I1U8m_kiYJn_5UFPX-4dW7AhbMrNzE39aT8xQN00yXaDLjpe39ZyTdKyevlf0fSBVQ7Nwr9KonfPxCnu1XQZw-Ee_6F9n0iv9Uq_uAqe1otrrB5a0mQnEqXCFm-TXyNlbTjJWxVOSdKK1Dg1fJzPPCZxVipD6WLI-RwEJZrAp9VK2NOmtO81c6BiWeCAX8VUqd91v_rXByReAPAZY7zNlatRvykzcvGlc2'
  },
  {
    title: 'Zooming Past The Haters',
    caption: 'Me moving on to better things in a soundproof chrome cyber-rover.',
    tag: '#SafariTech',
    description: 'An abstract depiction of leaving negative vibes behind in the neon sunset savanna.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbu_fZos68kbiMBweZPraiCBef1HeDQzb2KbbVhEthSjC2iVIlwpKLk2TLf4OcgVs36IW-rGy2gEYhO14Ughm8on9ZSJzKBJmBxQJ_tyzEpUiqZt2rnaPLkBVCGD4zSVX3zKwWH2lhroqZZWVK4-HbtMkt95MSJmDmS4C5aS_3P6o8rJUO3QGKbE2u1TjLEtXHhPZ3kNxikxdH4O-ksJ0N8XJP28jcea-WT6IbyLQWHVWKwb1uLseyOngDCr7FS1A1ggWYYG8V_geW'
  },
  {
    title: 'Ancestors Authenticating',
    caption: 'Checking the bio-rhythms of your proposal with historical intelligence.',
    tag: '#DigitalAncestry',
    description: 'Deep digital assessment of subtext, using golden filaments and holographic trails.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-07x5ZFN2CJNOmYHEKaHi8AfSCVriEaBiN4w0jr9BD4RKC2YhU9D9FGz1QWkxWa-Vf7gyJCH7nQHCecdsC_3ELibqIzg0xtzinSjhZujxVSwM-J9hzdr9hCp0AF6tI78LPjbeCcOa1LFrWw5taq8J8KFPVgy6wE6ACevG8NFcj9Um47wvQ7YvzPTjgJk8uTuij3_S-FMxF5aLO-rJaRMeEQm0ZbZK7X_ruDIJsdfDgRgUc_b3iDKSzbwhu_HQQImYQOx3MUd8d51p'
  }
];
