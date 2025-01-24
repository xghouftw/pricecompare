import { getAccessToken } from './KrogerAuth';

async function searchCatalogLocation(searchTerm, locationId, accessToken) {
    const url = new URL("https://api.kroger.com/v1/products");
    url.searchParams.set("filter.term", searchTerm);
    url.searchParams.set("filter.locationId", locationId);
    try {
        const response = await fetch(url.toString(), {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.data) return [];

        const items = data.data.map((product) => {
            const { 
              upc, 
              productPageURI,
              description, 
              brand, 
              items = [], 
              images = [] 
            } = product;
      
            // Price in an items list, for now consider the first. Consider promo it if exists
            let price = -1;
            if (items.length > 0 && items[0].price) {
                price = items[0].price.promo || items[0].price.regular || -1;
            }
            if (price === -1) return null;

            const webUrl = productPageURI ? `https://www.kroger.com${productPageURI}` : '';
      
            let imageUrl = '';
            if (images.length > 0 && images[0].sizes.length > 0) {
              imageUrl = images[0].sizes[0].url || '';
            }
      
            return {
              upc,
              description,
              brand,
              price,
              webUrl,
              imageUrl
            };
        });
        return items;

    } catch (err) {
      console.log(err);
    }
}

export async function searchCatalog(searchTerm, krogerLocations) {
    const accessToken = await getAccessToken('product.compact');
    const url = new URL("https://api.kroger.com/v1/products");
    url.searchParams.set("filter.term", searchTerm);
    try {
        const a = await searchCatalogLocation(searchTerm, krogerLocations[0], accessToken);
        console.log(a);
    } catch (err) {
      console.log(err);
      return [];
    }
}