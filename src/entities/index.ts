/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: aerospacetemplates
 * Interface for AerospaceTemplates
 */
export interface AerospaceTemplates {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType url */
  templateFileUrl?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  previewImage?: string;
}


/**
 * Collection ID: airfoilprofiles
 * Interface for AirfoilProfiles
 */
export interface AirfoilProfiles {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  profileName?: string;
  /** @wixFieldType text */
  coordinatesData?: string;
  /** @wixFieldType number */
  maximumThickness?: number;
  /** @wixFieldType number */
  maximumCamber?: number;
  /** @wixFieldType number */
  designReynoldsNumber?: number;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  profileImage?: string;
}


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
 * Collection ID: cfddatasets
 * Interface for CFDDatasets
 */
export interface CFDDatasets {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  datasetName?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  simulationParameters?: string;
  /** @wixFieldType url */
  dataDownloadUrl?: string;
  /** @wixFieldType text */
  category?: string;
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


/**
 * Collection ID: mechanicaltemplates
 * Interface for MechanicalTemplates
 */
export interface MechanicalTemplates {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType url */
  templateFileUrl?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  previewImage?: string;
  /** @wixFieldType text */
  version?: string;
}
