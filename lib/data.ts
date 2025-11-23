export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    category: string;
    slug: string;
    content: string;
}

export const blogPosts: BlogPost[] = [
    {
        id: '1',
        title: 'THE SINGULARITY IS NEAR: PREPARING FOR DIGITAL ASCENSION',
        excerpt: 'As we approach the event horizon of technological singularity, the line between biological and digital consciousness begins to blur. Are we ready for the upload?',
        date: '2025-11-23',
        readTime: '5 MIN READ',
        category: 'PHILOSOPHY',
        slug: 'singularity-is-near',
        content: `
      <p>The concept of the singularity has long fascinated both scientists and science fiction writers. It represents a point in time where technological growth becomes uncontrollable and irreversible, resulting in unfathomable changes to human civilization.</p>
      
      <h3>The Merging of Man and Machine</h3>
      <p>We are already seeing the early stages of this transition. Neural interfaces, advanced prosthetics, and AI-driven cognitive enhancements are no longer just theoretical concepts. They are becoming reality.</p>
      
      <p>But what happens when we can fully upload our consciousness to the cloud? Will we still be human? Or will we evolve into something entirely new?</p>
      
      <h3>The Ethical Implications</h3>
      <p>With great power comes great responsibility. The ability to enhance our minds and bodies raises significant ethical questions. Who will have access to these technologies? Will it create a new class divide between the enhanced and the unenhanced?</p>
      
      <p>As we march towards this uncertain future, we must remain vigilant. We must ensure that technology serves humanity, not the other way around.</p>
    `
    },
    {
        id: '2',
        title: 'CYBERNETIC AUGMENTATIONS 101: BEYOND HUMAN LIMITS',
        excerpt: 'From neural links to optical enhancements, the market for self-improvement has never been more invasive. A guide to safe modification.',
        date: '2025-11-20',
        readTime: '8 MIN READ',
        category: 'HARDWARE',
        slug: 'cybernetic-augmentations',
        content: `
      <p>In the year 2025, the human body is no longer a fixed biological entity. It is a canvas, waiting to be upgraded. From enhanced vision to increased strength, cybernetic augmentations offer a way to surpass our natural limits.</p>
      
      <h3>Types of Augmentations</h3>
      <ul>
        <li><strong>Neural Links:</strong> Direct interface with the digital world.</li>
        <li><strong>Optical Implants:</strong> Zoom, night vision, and AR overlays.</li>
        <li><strong>Subdermal Armor:</strong> Protection against physical trauma.</li>
      </ul>
      
      <h3>Safety First</h3>
      <p>While the benefits are tempting, the risks are real. Rejection, infection, and hacking are constant threats. Always consult a certified Ripperdoc before undergoing any procedure.</p>
    `
    },
    {
        id: '3',
        title: 'NEON NIGHTS: THE AESTHETICS OF THE POST-DIGITAL AGE',
        excerpt: 'Why do we crave the glow? Exploring the psychological impact of high-contrast interfaces in a low-light world.',
        date: '2025-11-15',
        readTime: '4 MIN READ',
        category: 'DESIGN',
        slug: 'neon-nights',
        content: `
      <p>The world is dark, but our screens are bright. The "Dark Sci-Fi" aesthetic isn't just a style; it's a reflection of our reality. We live in a world dominated by screens, where light is information and darkness is the void.</p>
      
      <h3>The Psychology of Glow</h3>
      <p>Neon colors cut through the darkness, demanding attention. They represent energy, vitality, and the artificial. In a world where nature is retreating, we find comfort in the synthetic glow of our devices.</p>
    `
    },
    {
        id: '4',
        title: 'SYSTEM FAILURE: ANALYZING THE GREAT CRASH OF 2024',
        excerpt: 'A retrospective on the cascade failure that nearly wiped out the global mesh network. Lessons learned from the darkness.',
        date: '2025-11-10',
        readTime: '12 MIN READ',
        category: 'HISTORY',
        slug: 'system-failure',
        content: `
      <p>It started with a single glitch. A corrupted packet in a routine update. Within hours, the entire global mesh network was offline. The Great Crash of 2024 was a wake-up call for humanity.</p>
      
      <h3>The Cascade Effect</h3>
      <p>Our systems are interconnected. When one fails, they all fail. The reliance on centralized servers proved to be our downfall. We must move towards true decentralization if we want to survive the next crash.</p>
    `
    }
];
