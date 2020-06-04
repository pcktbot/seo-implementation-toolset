export default {
  methods: {
    getPhrase(type, value) {
      const vertical = this.initSelects.selects[0].value
      const city = this.location.properties.city
      const state = this.location.properties.state
      const phrases = {
        mf: {
          neighborhood_phrases: `${value} apartments, ${value} ${city} apartments, ${value} ${city} ${state} apartments,
            ${value} apartments in ${city}, ${value} apartments in ${city} ${state}, apartments in ${value},
            apartments in ${value} ${city}, apartments in ${value} ${city} ${state}, apartments ${value},
            apartments ${value} ${city}, apartments ${value} ${city} ${state}, apartments ${city} in ${value},
            apartments ${city} ${state} in ${value}, ${city} apartments in ${value}, ${city} apartments near ${value},
            ${city} ${state} apartments in ${value}, ${city} ${state} apartments near ${value}, apartments near ${value},
            apartments near ${value} ${city}, apartments near ${value} ${city} ${state}, ${value} apartments near me,
            ${value} ${city} apartments near me, ${value} ${city} ${state} apartments near me, ${value} apartments for rent near me,
            ${value} apartments for rent, ${value} ${city} apartments for rent, ${value} ${city} ${state} apartments for rent,
            ${value} apartments for rent in ${city}, ${value} apartments for rent in ${city} ${state}, apartments for rent in ${value},
            apartments for rent in ${value} ${city}, apartments for rent in ${value} ${city} ${state}, apartments for rent ${value},
            apartments for rent ${value} ${city}, apartments for rent ${value} ${city} ${state}, apartments for rent ${city} in ${value},
            ${city} apartments for rent in ${value}, ${city} apartments for rent near ${value}, apartments for rent near ${value},
            apartments for rent near ${value} ${city}, ${value} apartment building, ${value} ${city} apartment building,
            ${value} ${city} ${state} apartment building, ${value} apartment building in ${city}, ${value} apartment building in ${city} ${state},
            apartment building in ${value}, apartment building in ${value} ${city}, apartment building in ${value} ${city} ${state},
            apartment building ${value}, apartment building ${value} ${city}, apartment building ${value} ${city} ${state},
            apartment building ${city} in ${value}, apartment building ${city} ${state} in ${value}, ${city} apartment building in ${value},
            ${city} apartment building near ${value}, ${city} ${state} apartment building in ${value}, ${city} ${state} apartment building near ${value},
            apartment building near ${value}, apartment building near ${value} ${city}, apartment building near ${value} ${city} ${state},
            ${value} apartment building near me, ${value} ${city} apartment building near me, ${value} apartment building for rent,
            ${value} ${city} apartment building for rent, apartment building for rent in ${value}, apartment building for rent ${value},
            apartment building for rent ${value} ${city}, apartment building for rent near ${value}, ${value} apartment complexes,
            ${value} ${city} apartment complexes, ${value} ${city} ${state} apartment complexes, ${value} apartment complexes in ${city},
            ${value} apartment complexes in ${city} ${state}, apartment complexes in ${value}, apartment complexes in ${value} ${city},
            apartment complexes in ${value} ${city} ${state}, apartment complexes ${value}, apartment complexes ${value} ${city},
            apartment complexes ${value} ${city} ${state}, apartment complexes ${city} in ${value}, apartment complexes ${city} ${state} in ${value},
            ${city} apartment complexes in ${value}, ${city} apartment complexes near ${value}, ${city} ${state} apartment complexes in ${value},
            ${city} ${state} apartment complexes near ${value}, apartment complexes near ${value}, apartment complexes near ${value} ${city},
            apartment complexes near ${value} ${city} ${state}, ${value} apartment complexes near me, ${value} ${city} apartment complexes near me,
            ${value} apartment complexes for rent, ${value} ${city} apartment complexes for rent, apartment complexes for rent in ${value},
            apartment complexes for rent ${value}, apartment complexes for rent ${value} ${city}, apartment complexes for rent near ${value},
            ${value} apartment homes, ${value} ${city} apartment homes, ${value} ${city} ${state} apartment homes, ${value} apartment homes in ${city},
            ${value} apartment homes in ${city} ${state}, apartment homes in ${value}, apartment homes in ${value} ${city},
            apartment homes in ${value} ${city} ${state}, apartment homes ${value}, apartment homes ${value} ${city}, apartment homes ${value} ${city} ${state},
            apartment homes ${city} in ${value}, apartment homes ${city} ${state} in ${value}, ${city} apartment homes in ${value},
            ${city} apartment homes near ${value}, ${city} ${state} apartment homes in ${value}, ${city} ${state} apartment homes near ${value},
            apartment homes near ${value}, apartment homes near ${value} ${city}, apartment homes near ${value} ${city} ${state},
            ${value} apartment homes near me, ${value} ${city} apartment homes near me, ${value} apartment homes for rent, ${value} ${city} apartment homes for rent,
            apartment homes for rent in ${value}, apartment homes for rent ${value}, apartment homes for rent ${value} ${city}, apartment homes for rent near ${value}`,
          landmark_phrases: `apartments near ${value}, ${city} apartments near ${value}, apartments in ${city} near ${value}, 
            ${city} ${state} apartments near ${value}, apartments in ${city} ${state} near ${value}, apartments near ${value} in ${city}, 
            apartments near ${value} in ${city} ${state}, apartments for rent near ${value}`,
          amenity_phrases: `apartments with ${value}, ${city} apartments with a ${value}, ${city} ${state} apartments with ${value}, apartments in ${city} with ${value}, 
            apartments in ${city} ${state} with ${value}, apartments with ${value} in ${city}, apartments with ${value} in ${city} ${state}, 
            apartments for rent with ${value}, ${city} apartments for rent with ${value}`
        },
        ss: {
          neighborhood_phrases: `Nearest storage facility in ${value} ${city}, Nearest storage facility in ${value}, Self storage facilities near ${value} ${city}, 
            Self storage facilities near ${value}, ${city} self storage facilities near ${value}, Storage facilities near ${value} ${city} ${state}, 
            Storage facilities near ${value} ${city}, Storage facilities near ${value}, ${city} ${state} storage facilities near ${value}, 
            ${city} storage facilities near ${value}, Storage facility rental in ${value} ${city}, Storage facility rental in ${value}, 
            ${city} storage facility rental in ${value}, ${value} storage facility rental in ${city}, ${value} storage facility rental, 
            ${value} ${city} ${state} storage facility rental, ${value} ${city} storage facility rental, ${value} storage facility rental, 
            Self storage for rent near ${value}, Self storage near ${value} ${city} ${state}, Self storage near ${value} ${city}, 
            Self storage near ${value}, ${city} self storage near ${value}, ${city} ${state} self storage near ${value}, 
            Self storage nearby ${value} ${city} ${state}, Self storage nearby ${value} ${city}, Self storage nearby ${value}, 
            ${city} self storage nearby ${value}, ${city} ${state} self storage nearby ${value}, Self storage in ${value} ${city} ${state}, 
            Self storage in ${value} ${city}, Self storage in ${value}, ${value} ${city} ${state} self storage, ${value} ${city} self storage, 
            ${value} self storage, ${value} self storage in ${city} ${state}, ${value} self storage in ${city}, ${city} ${state} self storage in ${value}, 
            ${city} self storage in ${value}, Storage for rent nearby ${value} ${city}, Storage for rent nearby ${value}, ${city} storage for rent nearby ${value}, 
            Storage near ${value} ${city} ${state}, Storage near ${value} ${city}, Storage near ${value}, ${city} storage near ${value}, 
            ${city} ${state} storage near ${value}, Storage nearby ${value} ${city} ${state}, Storage nearby ${value} ${city}, Storage nearby ${value}, 
            ${city} storage nearby ${value}, ${city} ${state} storage nearby ${value}, Storage in ${value} ${city} ${state}, Storage in ${value} ${city}, 
            Storage in ${value}, ${value} ${city} ${state} storage, ${value} ${city} storage, ${value} storage, ${value} storage in ${city} ${state}, 
            ${value} storage in ${city}, ${city} ${state} storage in ${value}, ${city} storage in ${value}, ${value} self storage units for rent, 
            Self storage units near ${value} ${city}, Self storage units near ${value}, ${city} self storage units near ${value}, Self storage units nearby ${value} ${city}, 
            Self storage units nearby ${value}, ${city} self storage units nearby ${value}, Storage units near ${value} ${city} ${state}, Storage units near ${value} ${city}, 
            Storage units near ${value}, ${city} ${state} storage units near ${value}, ${city} storage units near ${value}, Storage units nearby ${value} ${city} ${state}, 
            Storage units nearby ${value} ${city}, Storage units nearby ${value}, ${city} ${state} storage units nearby ${value}, ${city} storage units nearby ${value}, 
            Storage units for rent near ${value}, Storage units for rent nearby ${value}, Storage units for rent in ${value}, ${value} storage units for rent, 
            ${value} ${city} storage units for rent, Self storage places near ${value} ${city}, Self storage places near ${value}, ${city} self storage places near ${value}, 
            Storage places near ${value} ${city} ${state}, Storage places near ${value} ${city}, Storage places near ${value}, ${city} ${state} storage places near ${value}, 
            ${city} storage places near ${value}, Storage places nearby ${value} ${city} ${state}, Storage places nearby ${value} ${city}, 
            Storage places nearby ${value}, ${city} ${state} storage places nearby ${value}, ${city} storage places nearby ${value}, Storage rental places in ${value} ${city}, 
            Storage rental places in ${value}, ${city} storage rental places in ${value}, ${value} ${city} ${state} storage rental places, 
            ${value} ${city} storage rental places, ${value} storage rental places, ${value} storage rental places in ${city}`,
          landmark_phrases: `Self storage facilities near ${value}, ${city} self storage facilities near ${value}, Storage facilities near ${value} in ${city}, 
            Storage facilities near ${value}, ${city} storage facilities near ${value}, Self storage facilities nearby ${value}, ${city} self storage facilities nearby ${value}, 
            Storage facilities nearby ${value} in ${city}, Storage facilities nearby ${value}, ${city} storage facilities nearby ${value}, 
            Storage facilities nearby ${value} in ${city}, Storage facilities nearby ${value}, ${city} storage facilities nearby ${value}, 
            Storage facilities nearby ${value} in ${city}, Storage facilities nearby ${value}, ${city} storage facilities nearby ${value}, 
            Storage facility rental nearby ${value}, ${city} storage facility rental nearby ${value}, Self storage for rent near ${value}, 
            Self storage near ${value} in ${city}, Self storage near ${value}, ${city} self storage near ${value}, Self storage by ${value} in ${city}, 
            Self storage by ${value}, ${city} self storage by ${value}, Storage near ${value} in ${city} ${state}, Storage near ${value} in ${city}, 
            Storage near ${value}, ${city} storage near ${value}, Storage by ${value} in ${city} ${state}, Storage by ${value} in ${city}, Storage by ${value}, 
            ${city} storage by ${value}, Self storage units near ${value} in ${city}, Self storage units near ${value}, ${city} self storage units near ${value}, 
            Storage units near ${value} in ${city}, Storage units near ${value}, ${city} storage units near ${value}, Storage units for rent near ${value}, 
            Storage units for rent by ${value}`
        },
        sl: {
          neighborhood_phrases: `Active senior living in ${value}, Active senior living in ${value} ${city}, Senior living in ${value}, 
            Senior living in ${value} ${city}, Senior living near ${value}, Senior living near ${value} ${city}, 
            Senior living communities near ${value}, Senior living communities near ${value} ${city}, Senior living communities in ${value}, 
            Senior living communities in ${value} ${city}, Senior living facilities near ${value}, Senior living facilities near ${value} ${city}, 
            Senior living facilities in ${value}, Senior living facilities in ${value} ${city}, Senior living residences in ${value}, 
            Senior living residences in ${value} ${city}, Aged care in ${value}, Aged care in ${value} ${city}, Aged care homes in ${value}, 
            Aged care homes in ${value} ${city}, Aged care services in ${value}, Aged care services in ${value} ${city}, Assisted living in ${value}, 
            Assisted living in ${value} ${city}, Assisted living near ${value}, Assisted living near ${value} ${city}, Assisted living communities in ${value}, 
            Assisted living communities in ${value} ${city}, Assisted living communities near ${value}, Assisted living communities near ${value} ${city}, 
            Assisted living facilities in ${value}, Assisted living facilities in ${value} ${city}, Assisted living facilities near ${value}, 
            Assisted living facilities near ${value} ${city}, Assisted living homes in ${value}, Assisted living homes in ${value} ${city}, 
            Assisted living homes near ${value}, Assisted living homes near ${value} ${city}, Assisted living memory care near ${value}, 
            Assisted living residence in ${value}, Assisted living residence in ${value} ${city}, Assisted living services in ${value}, 
            Assisted living services in ${value} ${city}, Senior assisted living in ${value}, Senior assisted living in ${value} ${city}, 
            Senior assisted living near ${value}, Senior assisted living near ${value} ${city}, Senior assisted living facilities in ${value}, 
            Hospice services in ${value}, Hospice services in ${value} ${city}, Hospice care in ${value}, Hospice care in ${value} ${city}, 
            Hospice care near ${value}, Hospice care near ${value} ${city}, Hospice near ${value}, Hospice near ${value} ${city}, 
            Elderly care in ${value}, Elderly care in ${value} ${city}, Elderly care near ${value}, Elderly care near ${value} ${city}, 
            Elderly home care in ${value}, Elderly home care in ${value} ${city}, Independent living communities in ${value}, 
            Independent living communities in ${value} ${city}, Independent living in ${value}, Independent living in ${value} ${city}, 
            Independent living near ${value}, Independent living near ${value} ${city}, Independent living facilities in ${value}, 
            Independent living facilities in ${value} ${city}, Independent living facilities near ${value}, Independent living facilities near ${value} ${city}, 
            Independent senior living in ${value}, Independent senior living in ${value} ${city}, Independent senior living near ${value}, 
            Independent senior living near ${value} ${city}, Senior apartments independent living in ${value}, Senior independent living communities in ${value}, 
            Senior independent living in ${value}, Senior independent living in ${value} ${city}, Senior independent living near ${value}, 
            Senior independent living near ${value} ${city}, Memory care in ${value}, Memory care in ${value} ${city}, Memory care near ${value}, 
            Memory care near ${value} ${city}, Memory care assisted living in ${value}, Skilled nursing facility in ${value}, 
            Skilled nursing facility in ${value} ${city}, Skilled nursing facility near ${value}, Skilled nursing facility near ${value} ${city}, 
            Skilled nursing home in ${value}, Skilled nursing home in ${value} ${city}, Skilled nursing near ${value}, Skilled nursing near ${value} ${city}, 
            Respite care in ${value}, Respite care in ${value} ${city}, Respite care near ${value}, Respite care near ${value} ${city}, 
            Respite home in ${value}, Respite home in ${value} ${city}, Respite services in ${value}, Respite services in ${value} ${city}, 
            Senior apartments in ${value}, Senior apartments in ${value} ${city}, Senior apartments near ${value}, Senior apartments near ${value} ${city}, 
            Senior care facilities in ${value}, Senior care facilities in ${value} ${city}, Senior care facilities near ${value}, 
            Senior care facilities near ${value} ${city}, Senior care near ${value}, Senior care near ${value} ${city}, Senior citizen housing near ${value}, 
            Senior citizen housing near ${value} ${city}, Senior citizen living in ${value}, Senior citizen living in ${value} ${city}, Senior communities in ${value}, 
            Senior communities in ${value} ${city}, Senior communities near ${value}, Senior communities near ${value} ${city}, Senior housing in ${value}, 
            Senior housing in ${value} ${city}, Senior housing near ${value}, Senior housing near ${value} ${city}, Senior home care in ${value}, 
            Senior home care in ${value} ${city}, Senior home in ${value}, Senior home in ${value} ${city}`,
          landmark_phrases: `independent living near ${value}, independent living near ${value} ${city}, independent living by ${value}, independent living by ${value} ${city}, 
            assisted living near ${value}, assisted living near ${value} ${city}, assisted living by ${value}, assisted living by ${value} ${city}, 
            senior living near ${value}, senior living near ${value} ${city}, senior living by ${value}, senior living by ${value} ${city}, memory care near ${value}, 
            memory care near ${value} ${city}, memory care by ${value}, memory care by ${value} ${city}, hospice care near ${value}, hospice care near ${value} ${city}, 
            hospice care by ${value}, hospice care by ${value} ${city}, respite care near ${value}, respite care near ${value} ${city}, respite care by ${value}, 
            respite care by ${value} ${city}`
        }
      }
      return phrases[vertical][type]
    }
  }
}
