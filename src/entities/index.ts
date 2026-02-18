/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: antigoals
 * Interface for AntiGoals
 */
export interface AntiGoals {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  statement?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType text */
  rationale?: string;
  /** @wixFieldType text */
  consequence?: string;
  /** @wixFieldType text */
  reinforcesPrinciple?: string;
}


/**
 * Collection ID: architectureprinciples
 * Interface for ArchitecturePrinciples
 */
export interface ArchitecturePrinciples {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  principleTitle?: string;
  /** @wixFieldType text */
  detailedExplanation?: string;
  /** @wixFieldType text */
  analogyUsed?: string;
  /** @wixFieldType text */
  keyConcepts?: string;
  /** @wixFieldType text */
  diagramText?: string;
  /** @wixFieldType text */
  relatedAntiGoals?: string;
}


/**
 * Collection ID: corephilosophy
 * Interface for CorePhilosophy
 */
export interface CorePhilosophy {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  philosophyTitle?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  emphasisKeyword?: string;
  /** @wixFieldType number */
  displayOrder?: number;
  /** @wixFieldType boolean */
  isKeyPrinciple?: boolean;
}
