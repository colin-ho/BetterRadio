import {useState} from 'react';
import { useAsync } from 'react-async-hook';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import useConstant from 'use-constant';
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


const useDebouncedSearch = () => {

    const [search, setSearch] = useState('');

    const searchSongsAsync = async(search)=>{
        const data = await axios.post("/spotify/search", {'query':search})
        const result = data.data.map(track => {
            const smallestAlbumImage = track.album.images.reduce(
                (smallest, image) => {
                if (image.height < smallest.height) return image
                return smallest
                },
                track.album.images[0]
            )
    
            const largestAlbumImage = track.album.images.reduce(
                (largest, image) => {
                if (image.height > largest.height) return image
                return largest
                },
                track.album.images[0]
            )
    
            return {
                artist: track.artists[0].name,
                title: track.name,
                uri: track.uri,
                albumUrl: smallestAlbumImage.url,
                id: track.id,
                largeAlbumUrl:largestAlbumImage.url,
            }
        })  
        return result
    }
  
    const debouncedSearchFunction = useConstant(() =>
      AwesomeDebouncePromise(searchSongsAsync, 300)
    );

    const searchResults = useAsync(
      async () => {
        if (search.length === 0) {
          return null;
        } else {
          return debouncedSearchFunction(search);
        }
      },
      [debouncedSearchFunction, search]
    );

    return {
      search,
      setSearch,
      searchResults,
    };
  };

export default useDebouncedSearch