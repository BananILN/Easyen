import img1 from './assets/absback.png'
import img2 from './assets/absback2.png'
import img3 from './assets/absback5.png'
import img4 from './assets/absback4.png'
import { matchPath } from 'react-router';

const REQUEST_TIMEOUT = 3000;


export const courseMock = [
    {
        id: 0,
        title: 'Basic English',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        imageUrl:img1
    },
    {
        id: 1,
        title: 'Intemediate',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        imageUrl:img2
    },
    {
        id: 2,
        title: 'Upper-Intermediate',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        imageUrl:img3
    },
    {
        id: 3,
        title: 'Advanced',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        imageUrl:img4
    },
]
const mockRequest = (data) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data),500);
    });
  };

const mockData = [
    [
        "/courses",
        ({search}) =>
            search
                ? courseMock.filter((item) =>
                    item.title.toLowerCase().includes(search.toLowerCase())
                )
                : courseMock,
        
    ],
    [
      "/courses/:id",
      ({ id }) => {
        const course = courseMock.find((course) => course.id === Number(id));
        console.log("Course found:", course); // Отладочное сообщение
        return course || null;
      },
    ],
];



  
  export const mockFetch = async (requestUrl, options) => {
    console.log("Fetching", requestUrl, options);
  
    const [matchedUrl, getMocks] =
      mockData.find(([url]) => Boolean(matchPath(url, requestUrl))) || [];
  
    if (!getMocks) {
      return { error: { status: 404, message: "Requested data not found" } };
    }

    const { params } = matchPath(matchedUrl, requestUrl);
  
    const response = await mockRequest(getMocks({ ...params, ...options }));
  
    console.log("Response for:", requestUrl, options, response);
  
    return response;
  };
  
window.mockFetch = mockFetch;