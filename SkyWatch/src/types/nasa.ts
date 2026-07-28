export interface NasaApiResponse {
  element_count: number;
  near_earth_objects: Record<string, NasaNeoEntry[]>;
}

export interface NasaNeoEntry {
  id: string;
  name: string;
  absolute_magnitude_h: number;
  is_potentially_hazardous_asteroid: boolean;
  estimated_diameter: {
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  orbital_data: {
    orbit_class: {
      orbit_class_type: string;
      orbig_class_description: string;
    };
  };
  close_approach_data: CloseApproachData[];
}

export interface CloseApproachData {
  close_approach_date_full: string;
  miss_distance: {
    lunar: string;
    kilometers: string;
  };
  relative_velocity: {
    kilometers_per_second: string;
    kilometers_per_hour: string;
  }
}