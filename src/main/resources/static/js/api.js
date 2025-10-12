const API = {

  async getPictures(product, page, pageSize, path, orientation) {
    const searchParams = new URLSearchParams();
    searchParams.set("categoryPath", path || "");
    searchParams.set("productType", product);
    searchParams.set("page", page);
    searchParams.set("pageSize", pageSize);

    const resp = await fetch(
      `${backendUrl}/category-images?${searchParams.toString()}`
    );
    const images = await resp.json();

    const urls = images.items?.map(url => url.replaceAll("\\", "/"))
    return {
      total: images.total,
      images: urls
    }
  },
  async getCategories(product) {
    const queryParams = new URLSearchParams({ product });

    const resp = await fetch(
      `${backendUrl}/categories?${queryParams}`
    );
    return resp.json();
  },
  getImageUrl(product, path) {
    return `${backendUrl}/category-image?${new URLSearchParams({
      productType: product,
      path: path
    })}`
  },
  getImageUrlForEditor(product, path) {
    return `${backendUrl}/editor/background?${new URLSearchParams({
      product: product,
      path: path
    })}`
  },


  async login(credentials) {
    const resp = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(credentials)
    })

    return {
      result: await resp.json(),
      response: resp
    }
  },
  async signup(data) {
    return fetch(`${backendUrl}/auth/signup`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(data)
    })
  },
  async verifyEmail(code) {
    const resp = await fetch(`${backendUrl}/auth/verify-email`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ code })
    })

    return resp.json()
  },
  async updateUser(userData) {
    const jwt = auth.getToken()

    const resp = await fetch(`${backendUrl}/users`, {
      method: "PUT",
      body: JSON.stringify(userData),
      headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${jwt}`
      }
    })

    return {
      response: resp
    }
  },
  async refreshJWT() {
    const jwt = auth.getToken()

    const headers = {
      "content-type": "application/json",
      authorization: `Bearer ${jwt}`
    }

    const resp = await fetch(`${backendUrl}/users/refresh-token`, {
      method: "POST",
      headers: headers
    })

    const updateJWT = await resp.text()

    auth.setToken(updateJWT)
  },

  async createDesign(design) {
    const jwt = auth.getToken()

    const headers = {
      "content-type": "application/json"
    }

    if(jwt) {
      headers.authorization = `Bearer ${jwt}`
    }

    const resp = await fetch(`${backendUrl}/editor/design`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(design)
    })

    return { result: await resp.text(), response: resp }
  },
  async updateDesign(design) {
    const resp = await fetch(`${backendUrl}/editor/design`, {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(design)
    })

    return resp.text()
  },
  _formatDesignRequest(design) {

  },
  async getDesign(designId) {
    const resp = await fetch(`${backendUrl}/editor/design/${designId}`)

    const design = await resp.json()

  
    return {
      result: design ? API._formatDesignResponse(design) : null,
      response: resp
    }
  },
  _formatDesignResponse(designResponse) {
    const design = { ...designResponse }

    function formatSide(side) {
      return {
        ...side,
        elements: side.elements?.map(element => ({
          ...element,
          id: element.fieldName || "image-id-" + element.name,
          backendId: element.id
        }))
      }
    }

    if (design.front) {
      design.front = formatSide(design.front)
    }

    if (design.back) {
      design.back = formatSide(design.back)
    }

    return design
  },
  async uploadEditorImage(imageFile, selection) {
    const formData = new FormData()
    formData.append("file", imageFile)
    formData.append("selection", JSON.stringify(selection || null))

    const resp = await fetch(`${backendUrl}/editor/image`, {
      method: "POST",
      body: formData
    })

    return resp.text()
  },
  getEditorImageUrl(imageId) {
    return `${backendUrl}/editor/image?name=${imageId}`
  },
  getDesignPreviewImageUrl(designId, side) {
    return `${backendUrl}/editor/preview?name=${designId}&side=${side}`
  },
  getModelImage(modelColorId) {
    return `/api/model-image?modelColorId=${modelColorId}`
  },
  async getModel(modelColorId) {
    const resp = await fetch(`${backendUrl}/models/${modelColorId}`)
    return {
      response: resp,
      result: await resp.json()
    }
  },
  async getModelColor(modelColorId) {
    const resp = await fetch(`${backendUrl}/model-color/${modelColorId}`)
    return {
      response: resp,
      result: await resp.json()
    }
  },
  async getFavoriteDesigns() {
    const jwt = auth.getToken()

    const resp = await fetch(`${backendUrl}/editor/design/favorite`, {
      headers: {
        "Authorization": `Bearer ${jwt}`
      }
    })

    return {
      response: resp,
      result: await resp.json()
    }
  },


  async createShoppingCart() {
    const resp = await fetch(`${backendUrl}/cart`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      }
    })

    return resp.text()
  },
  async addShoppingCartItem(cartId, cart) {
    const resp = await fetch(`${backendUrl}/cart/${cartId}/item`, {
      method: "POST",
      body: JSON.stringify(cart),
      headers: {
        "content-type": "application/json"
      }
    })

    return resp.text()
  },
  async getCart(cartId) {
    const resp = await fetch(`${backendUrl}/cart/${cartId}`, {
      headers: {
        "content-type": "application/json"
      }
    })
    return resp.json()
  },
  async deleteCartItem(itemId) {
    return fetch(`${backendUrl}/cart/item/${itemId}`, {
      method: "DELETE"
    })
  },
  async makeOrder(cartId, details) {
    const jwt = auth.getToken()

    const headers = {
      "content-type": "application/json"
    }

    if(jwt) {
      headers.authorization = `Bearer ${jwt}`
    }

    const resp = await fetch(`${backendUrl}/cart/${cartId}/order`, {
      method: "POST",
      body: JSON.stringify(details),
      headers: headers
    })

    return {
      result: await resp.text(),
      response: resp
    }
  },
  async getUserOrders() {
    const jwt = auth.getToken()
    const resp = await fetch(`${backendUrl}/orders/user`, {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + jwt
      }
    })

    const orders = (await resp.json()) || []

    const result = await Promise.all(orders?.map(async order => ({
      ...order,
      cart: await API.getCart(order.cartId)
    })))

    return {
      response: resp,
      result: result
    }
  },

  async getPrices(productType, modelColorId = null) {
    const params = new URLSearchParams()
    params.set("product", productType)

    
    if(modelColorId) {
      params.set("modelColorId", modelColorId)
    }

    const resp = await fetch(`${backendUrl}/prices?${params}`)
    return await resp.json()  
  },
  async getEffectsPrices(productType) {
    const resp = await fetch(`${backendUrl}/prices/effects?product=${productType}`)
    return resp.json()
  },
  async getEffectPapersPrices() {
    const resp = await fetch(`${backendUrl}/prices/effect-cartons`)
    return resp.json()
  },
  async updatePrices(productType, amount, prices) {
    const jwt = auth.getToken()
    const resp = await fetch(`${backendUrl}/admin/prices`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + jwt
      },
      body: JSON.stringify({
        productType, amount, prices
      })
    })
    return await resp.json()  
  },
  async getOrder(orderId) {
    const resp = await fetch(`${backendUrl}/orders/${orderId}`)

    return {
      response: resp,
      result: await resp.json()
    }
  }
}