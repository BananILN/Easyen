import img1 from 'src/assets/absback.png'
import img2 from 'src/assets/absback2.png'
import img3 from 'src/assets/absback5.png'
import img4 from 'src/assets/absback4.png'

const REQUEST_TIMEOUT = 3000;


export const courseMock = [
    {
        id: 0,
        title: 'Basic English',
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageUrl:img1
    },
    {
        id: 1,
        title: 'Intemediate',
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageUrl:img2
    },
    {
        id: 2,
        title: 'Upper-Intermediate',
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageUrl:img3
    },
    {
        id: 3,
        title: 'Advanced',
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore  magna aliqua.",
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


const mockRequest = (data) =>{
    return new Promise((resolve) =>{
        setTimeout(() => resolve(data), REQUEST_TIMEOUT * Math.random())
    })
}

export const mockFetch = async (requestURl, options) =>{
    console.log("fetching", requestURl, options);

    const [matchedURL, getMocks] = 
        mockData.find(([url]) => Boolean(mathPath(url, requestURl))) || [];
        
    if(!getMocks){
        return { error: { status: 404, message: "Requested data not found" } };
    }

    const {params} = mathPath(matchedURL,requestURl);

    const response = await mockRequest(getMocks({...params, ...options}));

    console.log("Response for:", requestURl, options, response);

    return response;
}
window.mockFetch = mockFetch;