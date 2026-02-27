
export interface SalesRecord {
    UserId: number;
    UserName: string;
    Region: string;
    Country: string;
    TenantId: number;
    Product: string;
    TotalSales: number;
    UnitsSold: number;
    ReportDate: string;
    ImageUrl: string;
}

export const mockData: SalesRecord[] = [
    {
      "UserId": 1,
      "UserName": "Sophia Reynolds",
      "Region": "North America",
      "Country": "Mexico",
      "TenantId": 1,
      "Product": "Gadget",
      "TotalSales": 127347,
      "UnitsSold": 426,
      "ReportDate": "2024-11-28",
      "ImageUrl": "https://picsum.photos/seed/NorthAmerica/200/200?text=Sales+Image"
    },
    {
      "UserId": 1,
      "UserName": "Sophia Reynolds",
      "Region": "North America",
      "Country": "Canada",
      "TenantId": 3,
      "Product": "Gadget",
      "TotalSales": 78833,
      "UnitsSold": 892,
      "ReportDate": "2024-12-21",
      "ImageUrl": "https://picsum.photos/seed/NorthAmerica/200/200?text=Sales+Image"
    },
    {
      "UserId": 1,
      "UserName": "Sophia Reynolds",
      "Region": "Europe",
      "Country": "Spain",
      "TenantId": 1,
      "Product": "Gadget",
      "TotalSales": 1451447,
      "UnitsSold": 627,
      "ReportDate": "2025-07-29",
      "ImageUrl": "https://picsum.photos/seed/Europe/200/200?text=Sales+Image"
    },
    {
      "UserId": 1,
      "UserName": "Sophia Reynolds",
      "Region": "Asia",
      "Country": "Indonesia",
      "TenantId": 1,
      "Product": "Gadget",
      "TotalSales": 980789,
      "UnitsSold": 876,
      "ReportDate": "2024-10-12",
      "ImageUrl": "https://picsum.photos/seed/Asia/200/200?text=Sales+Image"
    },
    {
      "UserId": 1,
      "UserName": "Sophia Reynolds",
      "Region": "Oceania",
      "Country": "Australia",
      "TenantId": 1,
      "Product": "Gadget",
      "TotalSales": 8043073,
      "UnitsSold": 505,
      "ReportDate": "2025-04-09",
      "ImageUrl": "https://picsum.photos/seed/Oceania/200/200?text=Sales+Image"
    },

    {
      "UserId": 2,
      "UserName": "James Carter",
      "Region": "North America",
      "Country": "Mexico",
      "TenantId": 2,
      "Product": "Widget",
      "TotalSales": 145526,
      "UnitsSold": 246,
      "ReportDate": "2025-09-04",
      "ImageUrl": "https://picsum.photos/seed/NorthAmerica/200/200?text=Sales+Image"
    },
    {
      "UserId": 2,
      "UserName": "James Carter",
      "Region": "North America",
      "Country": "USA",
      "TenantId": 1,
      "Product": "Widget",
      "TotalSales": 70234,
      "UnitsSold": 342,
      "ReportDate": "2025-09-02",
      "ImageUrl": "https://picsum.photos/seed/NorthAmerica/200/200?text=Sales+Image"
    },
    {
      "UserId": 2,
      "UserName": "James Carter",
      "Region": "Europe",
      "Country": "France",
      "TenantId": 2,
      "Product": "Widget",
      "TotalSales": 102391,
      "UnitsSold": 665,
      "ReportDate": "2024-12-13",
      "ImageUrl": "https://picsum.photos/seed/Europe/200/200?text=Sales+Image"
    },
    {
      "UserId": 2,
      "UserName": "James Carter",
      "Region": "Asia",
      "Country": "Japan",
      "TenantId": 2,
      "Product": "Widget",
      "TotalSales": 14954461,
      "UnitsSold": 840,
      "ReportDate": "2025-01-11",
      "ImageUrl": "https://picsum.photos/seed/Asia/200/200?text=Sales+Image"
    },
    {
      "UserId": 2,
      "UserName": "James Carter",
      "Region": "Oceania",
      "Country": "Fiji",
      "TenantId": 2,
      "Product": "Widget",
      "TotalSales": 13751806,
      "UnitsSold": 578,
      "ReportDate": "2025-06-04",
      "ImageUrl": "https://picsum.photos/seed/Oceania/200/200?text=Sales+Image"
    },

    {
      "UserId": 3,
      "UserName": "Olivia Bennett",
      "Region": "North America",
      "Country": "USA",
      "TenantId": 3,
      "Product": "Gizmo",
      "TotalSales": 140181,
      "UnitsSold": 428,
      "ReportDate": "2024-11-19",
      "ImageUrl": "https://picsum.photos/seed/NorthAmerica/200/200?text=Sales+Image"
    },
    {
      "UserId": 3,
      "UserName": "Olivia Bennett",
      "Region": "North America",
      "Country": "Mexico",
      "TenantId": 2,
      "Product": "Gizmo",
      "TotalSales": 96638,
      "UnitsSold": 934,
      "ReportDate": "2025-09-15",
      "ImageUrl": "https://picsum.photos/seed/NorthAmerica/200/200?text=Sales+Image"
    },
    {
      "UserId": 3,
      "UserName": "Olivia Bennett",
      "Region": "Europe",
      "Country": "Germany",
      "TenantId": 3,
      "Product": "Gizmo",
      "TotalSales": 76979,
      "UnitsSold": 826,
      "ReportDate": "2025-07-08",
      "ImageUrl": "https://picsum.photos/seed/Europe/200/200?text=Sales+Image"
    },
    {
      "UserId": 3,
      "UserName": "Olivia Bennett",
      "Region": "Asia",
      "Country": "Indonesia",
      "TenantId": 3,
      "Product": "Gizmo",
      "TotalSales": 10883971,
      "UnitsSold": 879,
      "ReportDate": "2025-07-22",
      "ImageUrl": "https://picsum.photos/seed/Asia/200/200?text=Sales+Image"
    },
    {
      "UserId": 3,
      "UserName": "Olivia Bennett",
      "Region": "Oceania",
      "Country": "Australia",
      "TenantId": 3,
      "Product": "Gizmo",
      "TotalSales": 894104,
      "UnitsSold": 218,
      "ReportDate": "2024-12-03",
      "ImageUrl": "https://picsum.photos/seed/Oceania/200/200?text=Sales+Image"
    },

    {
      "UserId": 4,
      "UserName": "Ethan Patel",
      "Region": "North America",
      "Country": "Canada",
      "TenantId": 1,
      "Product": "Thingamajig",
      "TotalSales": 116355,
      "UnitsSold": 657,
      "ReportDate": "2025-03-23",
      "ImageUrl": "https://picsum.photos/seed/NorthAmerica/200/200?text=Sales+Image"
    },
    {
      "UserId": 4,
      "UserName": "Ethan Patel",
      "Region": "North America",
      "Country": "Mexico",
      "TenantId": 3,
      "Product": "Thingamajig",
      "TotalSales": 143735,
      "UnitsSold": 536,
      "ReportDate": "2025-06-23",
      "ImageUrl": "https://picsum.photos/seed/NorthAmerica/200/200?text=Sales+Image"
    },
    {
      "UserId": 4,
      "UserName": "Ethan Patel",
      "Region": "Europe",
      "Country": "UK",
      "TenantId": 1,
      "Product": "Thingamajig",
      "TotalSales": 61989,
      "UnitsSold": 190,
      "ReportDate": "2025-02-09",
      "ImageUrl": "https://picsum.photos/seed/Europe/200/200?text=Sales+Image"
    },
    {
      "UserId": 4,
      "UserName": "Ethan Patel",
      "Region": "Asia",
      "Country": "Japan",
      "TenantId": 1,
      "Product": "Thingamajig",
      "TotalSales": 14010076,
      "UnitsSold": 729,
      "ReportDate": "2025-09-02",
      "ImageUrl": "https://picsum.photos/seed/Asia/200/200?text=Sales+Image"
    },
    {
      "UserId": 4,
      "UserName": "Ethan Patel",
      "Region": "Oceania",
      "Country": "Australia",
      "TenantId": 1,
      "Product": "Thingamajig",
      "TotalSales": 8963125,
      "UnitsSold": 750,
      "ReportDate": "2025-05-07",
      "ImageUrl": "https://picsum.photos/seed/Oceania/200/200?text=Sales+Image"
    },

    {
      "UserId": 5,
      "UserName": "Ava Thompson",
      "Region": "North America",
      "Country": "USA",
      "TenantId": 2,
      "Product": "Doodad",
      "TotalSales": 69705,
      "UnitsSold": 316,
      "ReportDate": "2024-11-24",
      "ImageUrl": "https://picsum.photos/seed/NorthAmerica/200/200?text=Sales+Image"
    },
    {
      "UserId": 5,
      "UserName": "Ava Thompson",
      "Region": "North America",
      "Country": "USA",
      "TenantId": 1,
      "Product": "Doodad",
      "TotalSales": 8751595,
      "UnitsSold": 911,
      "ReportDate": "2024-10-08",
      "ImageUrl": "https://picsum.photos/seed/NorthAmerica/200/200?text=Sales+Image"
    },
    {
      "UserId": 5,
      "UserName": "Ava Thompson",
      "Region": "Europe",
      "Country": "Spain",
      "TenantId": 2,
      "Product": "Doodad",
      "TotalSales": 136226,
      "UnitsSold": 947,
      "ReportDate": "2024-11-20",
      "ImageUrl": "https://picsum.photos/seed/Europe/200/200?text=Sales+Image"
    },
    {
      "UserId": 5,
      "UserName": "Ava Thompson",
      "Region": "Asia",
      "Country": "South Korea",
      "TenantId": 2,
      "Product": "Doodad",
      "TotalSales": 5132969,
      "UnitsSold": 806,
      "ReportDate": "2025-04-22",
      "ImageUrl": "https://picsum.photos/seed/Asia/200/200?text=Sales+Image"
    },
    {
      "UserId": 5,
      "UserName": "Ava Thompson",
      "Region": "Oceania",
      "Country": "Australia",
      "TenantId": 2,
      "Product": "Doodad",
      "TotalSales": 11829638,
      "UnitsSold": 817,
      "ReportDate": "2025-02-16",
      "ImageUrl": "https://picsum.photos/seed/Oceania/200/200?text=Sales+Image"
    },

    {
      "UserId": 1,
      "UserName": "Lucas Mitchell",
      "Region": "North America",
      "Country": "Canada",
      "TenantId": 2,
      "Product": "Gadget",
      "TotalSales": 245000,
      "UnitsSold": 580,
      "ReportDate": "2025-03-15",
      "ImageUrl": "https://picsum.photos/seed/NorthAmerica/200/200?text=Sales+Image"
    },
    {
      "UserId": 1,
      "UserName": "Lucas Mitchell",
      "Region": "Europe",
      "Country": "UK",
      "TenantId": 2,
      "Product": "Gadget",
      "TotalSales": 890000,
      "UnitsSold": 720,
      "ReportDate": "2025-06-10",
      "ImageUrl": "https://picsum.photos/seed/Europe/200/200?text=Sales+Image"
    },
    {
      "UserId": 1,
      "UserName": "Lucas Mitchell",
      "Region": "Asia",
      "Country": "Singapore",
      "TenantId": 2,
      "Product": "Gadget",
      "TotalSales": 1675000,
      "UnitsSold": 950,
      "ReportDate": "2025-08-22",
      "ImageUrl": "https://picsum.photos/seed/Asia/200/200?text=Sales+Image"
    },
    {
      "UserId": 1,
      "UserName": "Lucas Mitchell",
      "Region": "Oceania",
      "Country": "New Zealand",
      "TenantId": 2,
      "Product": "Gadget",
      "TotalSales": 420000,
      "UnitsSold": 310,
      "ReportDate": "2025-01-19",
      "ImageUrl": "https://picsum.photos/seed/Oceania/200/200?text=Sales+Image"
    },
    {
      "UserId": 1,
      "UserName": "Lucas Mitchell",
      "Region": "North America",
      "Country": "USA",
      "TenantId": 2,
      "Product": "Gadget",
      "TotalSales": 980000,
      "UnitsSold": 840,
      "ReportDate": "2024-12-05",
      "ImageUrl": "https://picsum.photos/seed/NorthAmerica/200/200?text=Sales+Image"
    },

    {
      "UserId": 2,
      "UserName": "Isabella Hayes",
      "Region": "North America",
      "Country": "Mexico",
      "TenantId": 2,
      "Product": "Widget",
      "TotalSales": 312000,
      "UnitsSold": 480,
      "ReportDate": "2025-04-18",
      "ImageUrl": "https://picsum.photos/seed/NorthAmerica/200/200?text=Sales+Image"
    },
    {
      "UserId": 2,
      "UserName": "Isabella Hayes",
      "Region": "Europe",
      "Country": "Germany",
      "TenantId": 2,
      "Product": "Widget",
      "TotalSales": 675000,
      "UnitsSold": 610,
      "ReportDate": "2025-07-12",
      "ImageUrl": "https://picsum.photos/seed/Europe/200/200?text=Sales+Image"
    },
    {
      "UserId": 2,
      "UserName": "Isabella Hayes",
      "Region": "Asia",
      "Country": "India",
      "TenantId": 2,
      "Product": "Widget",
      "TotalSales": 1450000,
      "UnitsSold": 880,
      "ReportDate": "2025-09-01",
      "ImageUrl": "https://picsum.photos/seed/Asia/200/200?text=Sales+Image"
    },
    {
      "UserId": 2,
      "UserName": "Isabella Hayes",
      "Region": "Oceania",
      "Country": "Australia",
      "TenantId": 2,
      "Product": "Widget",
      "TotalSales": 560000,
      "UnitsSold": 390,
      "ReportDate": "2025-02-25",
      "ImageUrl": "https://picsum.photos/seed/Oceania/200/200?text=Sales+Image"
    },
    {
      "UserId": 2,
      "UserName": "Isabella Hayes",
      "Region": "North America",
      "Country": "Canada",
      "TenantId": 2,
      "Product": "Widget",
      "TotalSales": 810000,
      "UnitsSold": 710,
      "ReportDate": "2024-11-30",
      "ImageUrl": "https://picsum.photos/seed/NorthAmerica/200/200?text=Sales+Image"
    }
  ]

export const mockDataByTenant = mockData.reduce((acc, record) => {
    if (!acc[record.TenantId]) {
        acc[record.TenantId] = []
    }
    acc[record.TenantId].push(record)
    return acc
}, {} as Record<number, SalesRecord[]>)
