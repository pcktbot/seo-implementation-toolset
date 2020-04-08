export default {
  data () {
    return {
      strategies: {
        mf: {
          mfa: {
            link: 'https://docs.google.com/spreadsheets/d/1QR7EH32NxyeGOqARCIt0qYtDX1WpzKMR2BcBqgqz0jY/edit',
            description: 'Orginal Multi Family A'
          },
          mfb: {
            link: 'https://docs.google.com/spreadsheets/d/1QR7EH32NxyeGOqARCIt0qYtDX1WpzKMR2BcBqgqz0jY/edit#gid=205657231',
            description: 'Orginal Multi Family B'
          },
          mfc: {
            link: 'https://docs.google.com/spreadsheets/d/1QR7EH32NxyeGOqARCIt0qYtDX1WpzKMR2BcBqgqz0jY/edit#gid=1615577095',
            description: 'Orginal Multi Family C'
          },
          townhomes: {
            link: 'https://docs.google.com/spreadsheets/d/1QR7EH32NxyeGOqARCIt0qYtDX1WpzKMR2BcBqgqz0jY/edit#gid=1798205500',
            description: 'Townhomes'
          },
          apartmentstownhomes: {
            link: 'https://docs.google.com/spreadsheets/d/1QR7EH32NxyeGOqARCIt0qYtDX1WpzKMR2BcBqgqz0jY/edit#gid=780478088',
            description: 'Apartments and Townhomes'
          },
          mobile: {
            link: 'https://docs.google.com/spreadsheets/d/1HiTnlOI1LdJbZgMKKUkA16kHfA3IfKZODdGJgitYy84/edit#gid=2128876466',
            description: 'Mobile Homes'
          },
          fiftyfiveplus: {
            link: 'https://docs.google.com/spreadsheets/d/1QR7EH32NxyeGOqARCIt0qYtDX1WpzKMR2BcBqgqz0jY/edit#gid=1581508741',
            description: '55+ Apartments'
          },
          senior: {
            link: 'https://docs.google.com/spreadsheets/d/1QR7EH32NxyeGOqARCIt0qYtDX1WpzKMR2BcBqgqz0jY/edit#gid=2023923072',
            description: 'Senior Apartments'
          },
          student: {
            link: 'https://docs.google.com/spreadsheets/d/1QR7EH32NxyeGOqARCIt0qYtDX1WpzKMR2BcBqgqz0jY/edit#gid=1242508099',
            description: 'Student Apartments'
          },
          mfa1: {
            link: 'https://docs.google.com/spreadsheets/d/1GLtJAZz242wvsbO0e8PoIZ5_rpIY4__ugcJlWU-JZ3o/edit#gid=0',
            description: 'MF - A1: City Population > 250k'
          },
          mfb1: {
            link: 'https://docs.google.com/spreadsheets/d/1GLtJAZz242wvsbO0e8PoIZ5_rpIY4__ugcJlWU-JZ3o/edit#gid=439462448',
            description: 'MF - B1: City Population > 250k'
          },
          mfc1: {
            link: 'https://docs.google.com/spreadsheets/d/1GLtJAZz242wvsbO0e8PoIZ5_rpIY4__ugcJlWU-JZ3o/edit#gid=1713677503',
            description: 'MF - C1: City Population > 250k'
          },
          mfa2: {
            link: 'https://docs.google.com/spreadsheets/d/1GLtJAZz242wvsbO0e8PoIZ5_rpIY4__ugcJlWU-JZ3o/edit#gid=171176864',
            description: 'MF - A2: W/ Qualifier - City Population > 250k'
          },
          mfb2: {
            link: 'https://docs.google.com/spreadsheets/d/1GLtJAZz242wvsbO0e8PoIZ5_rpIY4__ugcJlWU-JZ3o/edit#gid=1821359528',
            description: 'MF - B2: W/ Qualifier - City Population > 250k'
          },
          mfc2: {
            link: 'https://docs.google.com/spreadsheets/d/1GLtJAZz242wvsbO0e8PoIZ5_rpIY4__ugcJlWU-JZ3o/edit#gid=658080165',
            description: 'MF - C2: W/ Qualifier - City Population > 250k'
          },
          mfa3: {
            link: 'https://docs.google.com/spreadsheets/d/1GLtJAZz242wvsbO0e8PoIZ5_rpIY4__ugcJlWU-JZ3o/edit#gid=1176512061',
            description: 'MF - A3: City Population < 250k'
          },
          mfb3: {
            link: 'https://docs.google.com/spreadsheets/d/1GLtJAZz242wvsbO0e8PoIZ5_rpIY4__ugcJlWU-JZ3o/edit#gid=1189408739',
            description: 'MF - B3: City Population < 250k'
          },
          mfc3: {
            link: 'https://docs.google.com/spreadsheets/d/1GLtJAZz242wvsbO0e8PoIZ5_rpIY4__ugcJlWU-JZ3o/edit#gid=1000987766',
            description: 'MF - C3: City Population < 250k'
          },
          mfa4: {
            link: 'https://docs.google.com/spreadsheets/d/1GLtJAZz242wvsbO0e8PoIZ5_rpIY4__ugcJlWU-JZ3o/edit#gid=1129413093',
            description: 'MF - A4: W/ Qualifier - City Population < 250k'
          },
          mfb4: {
            link: 'https://docs.google.com/spreadsheets/d/1GLtJAZz242wvsbO0e8PoIZ5_rpIY4__ugcJlWU-JZ3o/edit#gid=1674478187',
            description: 'MF - B4: W/ Qualifier - City Population < 250k'
          },
          mfc4: {
            link: 'https://docs.google.com/spreadsheets/d/1GLtJAZz242wvsbO0e8PoIZ5_rpIY4__ugcJlWU-JZ3o/edit#gid=1102462401',
            description: 'MF - C4: W/ Qualifier - City Population < 250k'
          },
          mfy: {
            link: 'https://docs.google.com/spreadsheets/d/1GLtJAZz242wvsbO0e8PoIZ5_rpIY4__ugcJlWU-JZ3o/edit#gid=1655767480',
            description: 'Multifamily Marketing Cloud SEO Strategy - Y'
          },
          mfz: {
            link: 'https://docs.google.com/spreadsheets/d/1GLtJAZz242wvsbO0e8PoIZ5_rpIY4__ugcJlWU-JZ3o/edit#gid=1135013808',
            description: 'Multifamily Marketing Cloud SEO Strategy - Z'
          }
        },
        ss: {
          ssa: {
            link: 'https://docs.google.com/spreadsheets/d/1QR7EH32NxyeGOqARCIt0qYtDX1WpzKMR2BcBqgqz0jY/edit#gid=320995540',
            description: 'Self Storage Facility A'
          },
          ssalandmark: {
            link: 'https://docs.google.com/spreadsheets/d/1QR7EH32NxyeGOqARCIt0qYtDX1WpzKMR2BcBqgqz0jY/edit#gid=286369603',
            description: 'Self Storage Facility A (Landmark Only)'
          },
          ssb: {
            link: 'https://docs.google.com/spreadsheets/d/1QR7EH32NxyeGOqARCIt0qYtDX1WpzKMR2BcBqgqz0jY/edit#gid=1478939980',
            description: 'Self Storage Facility B'
          }
        },
        sl: {
          sla: {
            link: 'https://docs.google.com/spreadsheets/d/1QR7EH32NxyeGOqARCIt0qYtDX1WpzKMR2BcBqgqz0jY/edit#gid=649440825',
            description: 'Senior Living Community A'
          },
          slb: {
            link: 'https://docs.google.com/spreadsheets/d/1QR7EH32NxyeGOqARCIt0qYtDX1WpzKMR2BcBqgqz0jY/edit#gid=1742592240',
            description: 'Senior Living Community B'
          },
          slc: {
            link: 'https://docs.google.com/spreadsheets/d/1QR7EH32NxyeGOqARCIt0qYtDX1WpzKMR2BcBqgqz0jY/edit#gid=1248672502',
            description: 'Senior Living Community C'
          }
        }
      }
    }
  }
}
