type Attributes = {
  // Add other attributes as needed
  Safarit: number;
};

export type Profile = {
  id: string;
  name: string;
  uniqueId: string;
  attributes: Attributes;
};
