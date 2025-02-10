export interface Location {
  lat: number;
  lng: number;
}

export class Hospital {
  constructor(
    public id: string,
    public name: string,
    public address: string,
    public location: Location,
    public type: string,
    public icon?: string,
    public photos?: string[]
  ) {}

  static create(props: {
    id: string;
    name: string;
    address: string;
    location: Location;
    type: string;
    icon?: string;
    photos?: string[];
  }): Hospital {
    return new Hospital(
      props.id,
      props.name, 
      props.address,
      props.location,
      props.type,
      props.icon,
      props.photos
    );
  }
}
