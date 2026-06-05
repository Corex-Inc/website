import {
  Zap,
  Tag,
  Save,
  Leaf,
  Globe,
  RefreshCw,
  Terminal,
  BookOpen,
  Download,
  FileCode,
  Boxes,
  Github,
  Coffee,
} from 'lucide-react';

export const BASE_API_URL = "https://server.corexinc.dev"

export const HERO_BUTTONS = [
  { label: 'Documentation', icon: BookOpen, style: 'primary' as const, href: '/documentation' },
  { label: 'Meta Docs', icon: FileCode, style: 'secondary' as const, href: '#' },
  { label: 'Download', icon: Download, style: 'secondary' as const, href: '#' },
  { label: 'Sponsor', icon: Coffee, style: 'ghost' as const, href: '#' },
] as const;

export const FEATURES = [
  {
    icon: Zap,
    title: 'Compiled at Startup',
    description: 'Scripts are parsed once. Every call runs prebuilt bytecode - performance does not depend on the number of scripts.',
  },
  {
    icon: Tag,
    title: 'Tags Instead of Variables',
    description: '<player.name>, <player.location.x> - data is embedded directly into the string, no intermediate assignments needed.',
  },
  {
    icon: Save,
    title: 'Persistent Flags',
    description: 'A flag is written with a single command - on a player, a block, or globally. Survives restarts. Supports TTL for auto-expiring data.',
  },
  {
    icon: Leaf,
    title: 'Folia Support',
    description: 'Corex tracks threads and switches between regions automatically.',
  },
  {
    icon: Globe,
    title: 'Velocity - Same Syntax',
    description: 'Cross-server logic, global data, high performance - all with identical syntax.',
  },
  {
    icon: RefreshCw,
    title: 'Hot Reload',
    description: '/run reload - scripts are recompiled on the fly. The server keeps running, no restart needed.',
  },
] as const;

export const CODE_EXAMPLES = [
  {
    label: 'Task Scripts',
    code: `// Simple heal task
myHealTask:
  type: task
  script:
    - adjust <player> health:20
    - narrate "Healed <player.name>!"`,
  },
  {
    label: 'Tags & Flags',
    code: `// Welcome back with persistent flags
myCustomScript:
  type: events
  events:
    on player joins:
      - if <player.flag[visits].ifNull[0]> > 0:
        - flag <player> visits:+:1
        - narrate "Welcome back! Visit #<player.flag[visits]>"
        - stop
      - narrate "Hello, <player.name>!"`,
  },
  {
    label: 'Velocity Proxy',
    code: `// Cross-server command on Velocity
myVelocityScript:
  type: events
  events:
    after player connects:
      - narrate "Hello from proxy!"`,
  },
] as const;

export const PLATFORMS = [
  { name: 'Paper', desc: 'Full scripting support for the most popular server software.', icon: Terminal },
  { name: 'Folia', desc: 'Region-aware execution. Scripts just work - no thread handling required.', icon: Leaf },
  { name: 'Velocity', desc: 'Same syntax on the proxy. Cross-server logic, global data.', icon: Globe },
] as const;

export const ICONS = { Github, Boxes } as const;
