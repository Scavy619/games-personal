export interface EnrichmentCandidate {
  externalId: string;
  title: string;
  year?: number;
  thumbnailUrl?: string;
  subtitle?: string;
  raw: Record<string, unknown>;
}

export interface EnrichmentResult {
  candidate: EnrichmentCandidate;
  formFields: Record<string, unknown>;
}

export interface EnrichmentProvider {
  kind: "game" | "movie";
  name: string;
  search(query: string): Promise<EnrichmentResult[]>;
}
