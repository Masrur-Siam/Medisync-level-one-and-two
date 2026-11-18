import { DfdLevel, NodeKind } from './dfdData';

export interface SvgNodeBox {
  id: string;
  code: string;
  titleLines: string[];
  subtitle?: string;
  kind: NodeKind;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SvgArrow {
  id: string;
  flowRefId: string;
  fromId: string;
  toId: string;
  labelLines: string[];
  points: [number, number][];
  labelPos: [number, number];
  bridgeAt?: [number, number];
}

export interface DiagramSpec {
  level: DfdLevel;
  title: string;
  subtitle: string;
  width: number;
  height: number;
  nodes: SvgNodeBox[];
  arrows: SvgArrow[];
}

export const LEVEL0_SPEC: DiagramSpec = {
  level: 'level0',
  title: 'MediSync — Level 0 Data Flow Diagram (Context Diagram)',
  subtitle: 'Green University of Bangladesh · CSE-308 Design Project I · Group 6',
  width: 1260,
  height: 700,
  nodes: [
    {
      id: 'E1',
      code: 'E1',
      titleLines: ['Patient'],
      subtitle: 'Public / Registered User',
      kind: 'entity',
      x: 44,
      y: 205,
      w: 164,
      h: 245,
    },
    {
      id: 'P0',
      code: '0',
      titleLines: ['MediSync System', 'Live Chamber & Smart', 'Prescription Hub'],
      subtitle: 'Centralized SaaS Portal & Sub-domain Engine',
      kind: 'process',
      x: 475,
      y: 205,
      w: 310,
      h: 245,
    },
    {
      id: 'E2',
      code: 'E2',
      titleLines: ['Doctor'],
      subtitle: 'Chamber Admin & Prescriber',
      kind: 'entity',
      x: 1052,
      y: 205,
      w: 164,
      h: 245,
    },
    {
      id: 'E3',
      code: 'E3',
      titleLines: ['Assistant'],
      subtitle: 'Limited Appointment Staff',
      kind: 'entity',
      x: 495,
      y: 575,
      w: 270,
      h: 88,
    },
  ],
  arrows: [
    // Patient <-> System (6 straight horizontal channels, 36px apart)
    {
      id: 'L0-A1',
      flowRefId: 'L0-F1',
      fromId: 'E1',
      toId: 'P0',
      labelLines: ['Login & Specialty Search Query'],
      points: [
        [208, 236],
        [475, 236],
      ],
      labelPos: [341, 224],
    },
    {
      id: 'L0-A2',
      flowRefId: 'L0-F2',
      fromId: 'P0',
      toId: 'E1',
      labelLines: ['Doctor Directory & Schedule List'],
      points: [
        [475, 274],
        [208, 274],
      ],
      labelPos: [341, 262],
    },
    {
      id: 'L0-A3',
      flowRefId: 'L0-F3',
      fromId: 'E1',
      toId: 'P0',
      labelLines: ['Appointment Booking Request'],
      points: [
        [208, 312],
        [475, 312],
      ],
      labelPos: [341, 300],
    },
    {
      id: 'L0-A4',
      flowRefId: 'L0-F4',
      fromId: 'P0',
      toId: 'E1',
      labelLines: ['Booking Confirmation & Serial No.'],
      points: [
        [475, 350],
        [208, 350],
      ],
      labelPos: [341, 338],
    },
    {
      id: 'L0-A5',
      flowRefId: 'L0-F5',
      fromId: 'E1',
      toId: 'P0',
      labelLines: ['Prescription & History Request'],
      points: [
        [208, 388],
        [475, 388],
      ],
      labelPos: [341, 376],
    },
    {
      id: 'L0-A6',
      flowRefId: 'L0-F6',
      fromId: 'P0',
      toId: 'E1',
      labelLines: ['Private Digital Prescription'],
      points: [
        [475, 426],
        [208, 426],
      ],
      labelPos: [341, 414],
    },

    // Doctor <-> System (6 straight horizontal channels, 36px apart)
    {
      id: 'L0-A7',
      flowRefId: 'L0-F7',
      fromId: 'E2',
      toId: 'P0',
      labelLines: ['Login & Sub-domain Config'],
      points: [
        [1052, 236],
        [785, 236],
      ],
      labelPos: [918, 224],
    },
    {
      id: 'L0-A8',
      flowRefId: 'L0-F8',
      fromId: 'E2',
      toId: 'P0',
      labelLines: ['Profile & Chamber Schedule'],
      points: [
        [1052, 274],
        [785, 274],
      ],
      labelPos: [918, 262],
    },
    {
      id: 'L0-A9',
      flowRefId: 'L0-F9',
      fromId: 'P0',
      toId: 'E2',
      labelLines: ['Patient Queue & History View'],
      points: [
        [785, 312],
        [1052, 312],
      ],
      labelPos: [918, 300],
    },
    {
      id: 'L0-A10',
      flowRefId: 'L0-F10',
      fromId: 'E2',
      toId: 'P0',
      labelLines: ['Prescription Data (Meds & Tests)'],
      points: [
        [1052, 350],
        [785, 350],
      ],
      labelPos: [918, 338],
    },
    {
      id: 'L0-A11',
      flowRefId: 'L0-F11',
      fromId: 'P0',
      toId: 'E2',
      labelLines: ['Printable Prescription (Auto Date/Time)'],
      points: [
        [785, 388],
        [1052, 388],
      ],
      labelPos: [918, 376],
    },
    {
      id: 'L0-A12',
      flowRefId: 'L0-F12',
      fromId: 'E2',
      toId: 'P0',
      labelLines: ['Assistant Account & Access Rules'],
      points: [
        [1052, 426],
        [785, 426],
      ],
      labelPos: [918, 414],
    },

    // Assistant <-> System (3 vertical channels with staggered labels)
    {
      id: 'L0-A13',
      flowRefId: 'L0-F13',
      fromId: 'E3',
      toId: 'P0',
      labelLines: ['Limited Login', 'Credentials'],
      points: [
        [525, 575],
        [525, 450],
      ],
      labelPos: [525, 502],
    },
    {
      id: 'L0-A14',
      flowRefId: 'L0-F14',
      fromId: 'P0',
      toId: 'E3',
      labelLines: ['Simplified Schedule', 'View'],
      points: [
        [630, 450],
        [630, 575],
      ],
      labelPos: [630, 526],
    },
    {
      id: 'L0-A15',
      flowRefId: 'L0-F15',
      fromId: 'E3',
      toId: 'P0',
      labelLines: ['Appointment &', 'Queue Updates'],
      points: [
        [735, 575],
        [735, 450],
      ],
      labelPos: [735, 502],
    },
  ],
};

export const LEVEL1_SPEC: DiagramSpec = {
  level: 'level1',
  title: 'MediSync — Level 1 Data Flow Diagram',
  subtitle: 'Functional Decomposition · 6 Core Processes · 5 MySQL Data Stores · Balanced with Level 0',
  width: 1580,
  height: 890,
  nodes: [
    // External Entities
    {
      id: 'E1',
      code: 'E1',
      titleLines: ['Patient'],
      subtitle: 'Discovery, Booking & History',
      kind: 'entity',
      x: 56,
      y: 120,
      w: 148,
      h: 515,
    },
    {
      id: 'E3',
      code: 'E3',
      titleLines: ['Assistant'],
      subtitle: 'Limited Appointment Staff',
      kind: 'entity',
      x: 382,
      y: 745,
      w: 206,
      h: 88,
    },
    {
      id: 'E2',
      code: 'E2',
      titleLines: ['Doctor'],
      subtitle: 'Chamber Admin & Prescriber',
      kind: 'entity',
      x: 1396,
      y: 155,
      w: 144,
      h: 525,
    },

    // Processes (Column 2: User-facing & Core)
    {
      id: 'P1',
      code: '1.0',
      titleLines: ['Authentication &', 'Role Access Control'],
      kind: 'process',
      x: 370,
      y: 108,
      w: 230,
      h: 88,
    },
    {
      id: 'P2',
      code: '2.0',
      titleLines: ['Doctor Directory &', 'Sub-domain Routing'],
      kind: 'process',
      x: 370,
      y: 250,
      w: 230,
      h: 88,
    },
    {
      id: 'P5',
      code: '5.0',
      titleLines: ['Patient History &', 'Privacy Access'],
      kind: 'process',
      x: 370,
      y: 396,
      w: 230,
      h: 88,
    },
    {
      id: 'P3',
      code: '3.0',
      titleLines: ['Appointment &', 'Queue Management'],
      kind: 'process',
      x: 370,
      y: 550,
      w: 230,
      h: 92,
    },

    // Processes (Column 4: Doctor Chamber Operations)
    {
      id: 'P6',
      code: '6.0',
      titleLines: ['Assistant Account &', 'Access Delegation'],
      kind: 'process',
      x: 1065,
      y: 132,
      w: 225,
      h: 90,
    },
    {
      id: 'P4',
      code: '4.0',
      titleLines: ['Smart Digital', 'Prescription Generator'],
      kind: 'process',
      x: 1065,
      y: 410,
      w: 225,
      h: 96,
    },

    // Data Stores (Column 3: MySQL)
    {
      id: 'D1',
      code: 'D1',
      titleLines: ['Users & Auth Credentials'],
      kind: 'datastore',
      x: 745,
      y: 118,
      w: 220,
      h: 54,
    },
    {
      id: 'D5',
      code: 'D5',
      titleLines: ['Assistant Permissions'],
      kind: 'datastore',
      x: 745,
      y: 202,
      w: 220,
      h: 54,
    },
    {
      id: 'D2',
      code: 'D2',
      titleLines: ['Doctor Profiles & Sub-domains'],
      kind: 'datastore',
      x: 745,
      y: 304,
      w: 220,
      h: 54,
    },
    {
      id: 'D4',
      code: 'D4',
      titleLines: ['Medical Prescriptions (Private)'],
      kind: 'datastore',
      x: 745,
      y: 416,
      w: 220,
      h: 54,
    },
    {
      id: 'D3',
      code: 'D3',
      titleLines: ['Appointments & Schedules'],
      kind: 'datastore',
      x: 745,
      y: 568,
      w: 220,
      h: 54,
    },
  ],
  arrows: [
    // Patient <-> P1, P2, P5, P3
    {
      id: 'L1-E1-P1',
      flowRefId: 'L0-F1',
      fromId: 'E1',
      toId: 'P1',
      labelLines: ['Patient Login / Register'],
      points: [
        [204, 138],
        [370, 138],
      ],
      labelPos: [287, 126],
    },
    {
      id: 'L1-P1-E1',
      flowRefId: 'L0-F1',
      fromId: 'P1',
      toId: 'E1',
      labelLines: ['Auth Session Token'],
      points: [
        [370, 174],
        [204, 174],
      ],
      labelPos: [287, 162],
    },
    {
      id: 'L1-E1-P2',
      flowRefId: 'L0-F1',
      fromId: 'E1',
      toId: 'P2',
      labelLines: ['Specialty Search Query'],
      points: [
        [204, 274],
        [370, 274],
      ],
      labelPos: [287, 262],
    },
    {
      id: 'L1-P2-E1',
      flowRefId: 'L0-F2',
      fromId: 'P2',
      toId: 'E1',
      labelLines: ['Doctor List & Schedules'],
      points: [
        [370, 314],
        [204, 314],
      ],
      labelPos: [287, 302],
    },
    {
      id: 'L1-E1-P5',
      flowRefId: 'L0-F5',
      fromId: 'E1',
      toId: 'P5',
      labelLines: ['Rx & History Request'],
      points: [
        [204, 420],
        [370, 420],
      ],
      labelPos: [287, 408],
    },
    {
      id: 'L1-P5-E1',
      flowRefId: 'L0-F6',
      fromId: 'P5',
      toId: 'E1',
      labelLines: ['Private Digital Prescription'],
      points: [
        [370, 460],
        [204, 460],
      ],
      labelPos: [287, 448],
    },
    {
      id: 'L1-E1-P3',
      flowRefId: 'L0-F3',
      fromId: 'E1',
      toId: 'P3',
      labelLines: ['Booking Request'],
      points: [
        [204, 574],
        [370, 574],
      ],
      labelPos: [287, 562],
    },
    {
      id: 'L1-P3-E1',
      flowRefId: 'L0-F4',
      fromId: 'P3',
      toId: 'E1',
      labelLines: ['Confirmation & Serial No.'],
      points: [
        [370, 614],
        [204, 614],
      ],
      labelPos: [287, 602],
    },

    // Assistant <-> P3 & P1
    {
      id: 'L1-E3-P3',
      flowRefId: 'L0-F15',
      fromId: 'E3',
      toId: 'P3',
      labelLines: ['Queue & Status', 'Updates'],
      points: [
        [432, 745],
        [432, 642],
      ],
      labelPos: [432, 672],
    },
    {
      id: 'L1-P3-E3',
      flowRefId: 'L0-F14',
      fromId: 'P3',
      toId: 'E3',
      labelLines: ['Simplified', 'Schedule View'],
      points: [
        [542, 642],
        [542, 745],
      ],
      labelPos: [542, 714],
    },
    {
      id: 'L1-E3-P1',
      flowRefId: 'L0-F13',
      fromId: 'E3',
      toId: 'P1',
      labelLines: ['Limited Password-Protected Login'],
      points: [
        [382, 789],
        [24, 789],
        [24, 84],
        [445, 84],
        [445, 108],
      ],
      labelPos: [215, 72],
    },

    // P1 <-> D1 & D5
    {
      id: 'L1-P1-D1',
      flowRefId: 'L0-F1',
      fromId: 'P1',
      toId: 'D1',
      labelLines: ['Verify / Save User'],
      points: [
        [600, 134],
        [745, 134],
      ],
      labelPos: [672, 122],
    },
    {
      id: 'L1-D1-P1',
      flowRefId: 'L0-F1',
      fromId: 'D1',
      toId: 'P1',
      labelLines: ['Role & Hash Match'],
      points: [
        [745, 160],
        [600, 160],
      ],
      labelPos: [672, 148],
    },
    {
      id: 'L1-D5-P1',
      flowRefId: 'L0-F13',
      fromId: 'D5',
      toId: 'P1',
      labelLines: ['Scope Policy'],
      points: [
        [745, 229],
        [670, 229],
        [670, 184],
        [600, 184],
      ],
      labelPos: [670, 212],
    },

    // P6 <-> D1, D5, E2
    {
      id: 'L1-P6-D1',
      flowRefId: 'L0-F12',
      fromId: 'P6',
      toId: 'D1',
      labelLines: ['Assistant Creds'],
      points: [
        [1065, 152],
        [965, 152],
      ],
      labelPos: [1015, 140],
    },
    {
      id: 'L1-P6-D5',
      flowRefId: 'L0-F12',
      fromId: 'P6',
      toId: 'D5',
      labelLines: ['Access Rules'],
      points: [
        [1065, 212],
        [965, 212],
      ],
      labelPos: [1015, 226],
    },
    {
      id: 'L1-E2-P6',
      flowRefId: 'L0-F12',
      fromId: 'E2',
      toId: 'P6',
      labelLines: ['Assistant Account', '& Rules'],
      points: [
        [1396, 178],
        [1290, 178],
      ],
      labelPos: [1343, 158],
    },

    // P2 <-> D2, D2 -> P3
    {
      id: 'L1-P2-D2',
      flowRefId: 'L0-F8',
      fromId: 'P2',
      toId: 'D2',
      labelLines: ['Profile & Slug'],
      points: [
        [600, 316],
        [745, 316],
      ],
      labelPos: [672, 304],
    },
    {
      id: 'L1-D2-P2',
      flowRefId: 'L0-F2',
      fromId: 'D2',
      toId: 'P2',
      labelLines: ['Directory Data'],
      points: [
        [745, 340],
        [600, 340],
      ],
      labelPos: [672, 354],
    },

    // P5 <-> D4, P4 -> D4
    {
      id: 'L1-D4-P5',
      flowRefId: 'L0-F6',
      fromId: 'D4',
      toId: 'P5',
      labelLines: ['Verified Rx History'],
      points: [
        [745, 442],
        [600, 442],
      ],
      labelPos: [672, 430],
    },
    {
      id: 'L1-P4-D4',
      flowRefId: 'L0-F10',
      fromId: 'P4',
      toId: 'D4',
      labelLines: ['Save Rx', '(Auto Date/Time)'],
      points: [
        [1065, 446],
        [965, 446],
      ],
      labelPos: [1015, 470],
    },

    // P3 <-> D3
    {
      id: 'L1-P3-D3',
      flowRefId: 'L0-F3',
      fromId: 'P3',
      toId: 'D3',
      labelLines: ['Save / Update Slot'],
      points: [
        [600, 582],
        [745, 582],
      ],
      labelPos: [672, 570],
    },
    {
      id: 'L1-D3-P3',
      flowRefId: 'L0-F9',
      fromId: 'D3',
      toId: 'P3',
      labelLines: ['Queue & Slots'],
      points: [
        [745, 610],
        [600, 610],
      ],
      labelPos: [672, 624],
    },

    // D2 -> P3 (Availability slots) - routes cleanly between D4 and P4? Let's route left at x=642 with clean bridge over L1-D4-P5 at (642, 442)
    {
      id: 'L1-D2-P3',
      flowRefId: 'L0-F3',
      fromId: 'D2',
      toId: 'P3',
      labelLines: ['Chamber Slots'],
      points: [
        [765, 358],
        [765, 376],
        [642, 376],
        [642, 558],
        [600, 558],
      ],
      labelPos: [642, 504],
      bridgeAt: [642, 442],
    },

    // D2 -> P4 & D3 -> P4
    {
      id: 'L1-D2-P4',
      flowRefId: 'L0-F11',
      fromId: 'D2',
      toId: 'P4',
      labelLines: ['Doctor Header Info'],
      points: [
        [965, 336],
        [1018, 336],
        [1018, 424],
        [1065, 424],
      ],
      labelPos: [1018, 374],
    },
    {
      id: 'L1-D3-P4',
      flowRefId: 'L0-F10',
      fromId: 'D3',
      toId: 'P4',
      labelLines: ['Patient Visit Info'],
      points: [
        [965, 594],
        [1018, 594],
        [1018, 496],
        [1065, 496],
      ],
      labelPos: [1018, 550],
    },

    // Doctor (E2) <-> P1, P2, P4, P3
    {
      id: 'L1-E2-P1',
      flowRefId: 'L0-F7',
      fromId: 'E2',
      toId: 'P1',
      labelLines: ['Doctor Login & Admin Access'],
      points: [
        [1468, 155],
        [1468, 84],
        [525, 84],
        [525, 108],
      ],
      labelPos: [980, 72],
    },
    {
      id: 'L1-E2-P2',
      flowRefId: 'L0-F8',
      fromId: 'E2',
      toId: 'P2',
      labelLines: ['Profile, Schedule & Sub-domain Config'],
      points: [
        [1396, 276],
        [600, 276],
      ],
      labelPos: [1090, 264],
    },
    {
      id: 'L1-E2-P4',
      flowRefId: 'L0-F10',
      fromId: 'E2',
      toId: 'P4',
      labelLines: ['Meds, Tests & Notes'],
      points: [
        [1396, 434],
        [1290, 434],
      ],
      labelPos: [1343, 418],
    },
    {
      id: 'L1-P4-E2',
      flowRefId: 'L0-F11',
      fromId: 'P4',
      toId: 'E2',
      labelLines: ['Printable Rx', '(Auto Date/Time)'],
      points: [
        [1290, 482],
        [1396, 482],
      ],
      labelPos: [1343, 504],
    },
    {
      id: 'L1-P3-E2',
      flowRefId: 'L0-F9',
      fromId: 'P3',
      toId: 'E2',
      labelLines: ['Live Patient Appointment Queue'],
      points: [
        [585, 642],
        [585, 668],
        [1396, 668],
      ],
      labelPos: [1015, 656],
    },
  ],
};
