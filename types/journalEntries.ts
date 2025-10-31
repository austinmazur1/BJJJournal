export type SerializedJournalEntry = {
    _id: string;
    userId: string;
    date: string;
    duration: number;
    type: string;
    giNoGi: string;
    area: string;
    feeling?: string;
    questions?: string;
    location: string;
    professor?: string;
    depthNotes: string;
    otherNotes?: string;
    workOn?: string;
    partners: string[];
    createdAt: string;
    updatedAt: string;
  };
  