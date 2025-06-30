export class OfficeResource {
    static toJson(entity: any) {
      return {
        id: entity.id,
        name: entity.name,
        contact_number: entity.contactNumber,
        logo: entity.logo,
        city: entity.region?.city?.name || null, 
        region: entity.region?.name || null,
        location: {
          latitude: entity.latitude,
          longitude: entity.longitude,
        },
        opening_time: entity.opening_time,
        closing_time: entity.closing_time,
        socials: entity.socials.map(s => ({
          platform: s.platform,
          link: s.link,
        })),
      };
    }
  }