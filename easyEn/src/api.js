import img1 from './assets/absback.png'
import img2 from './assets/absback2.png'
import img3 from './assets/absback5.png'
import img4 from './assets/absback4.png'

const REQUEST_TIMEOUT = 3000;


export const courseMock = [
    {
        id: 0,
        title: 'Basic English',
        imageUrl:img1
    },
    {
        id: 1,
        title: 'Intemediate',
        imageUrl:img2
    },
    {
        id: 2,
        title: 'Upper-Intermediate',
        imageUrl:img3
    },
    {
        id: 3,
        title: 'Advanced',
        imageUrl:img4
    },
]

const mockData = [
    [
        "/coures",
        ({search}) =>
            search
                ? courseMock.filter((item) =>
                    item.title.toLowerCase().includes(search.toLowerCase())
                )
                : courseMock,
        
    ],
    ["/courses/:id", ({id}) => courseMock[id]],
]


const mockRequest = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), REQUEST_TIMEOUT * Math.random());
    });
  };
  
  export const mockFetch = async (requestUrl, options) => {
    console.log("Fetching", requestUrl, options);
  
    const [matchedUrl, getMocks] =
      mockData.find(([url]) => url === requestUrl) || [];
  
    if (!getMocks) {
      return { error: { status: 404, message: "Requested data not found" } };
    }
  
    const response = await mockRequest(getMocks(options));
  
    console.log("Response for:", requestUrl, options, response);
  
    return response;
  };