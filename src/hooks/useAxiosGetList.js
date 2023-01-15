import axios from 'axios';
import { processQueries } from 'function/processQueries';
import { useState, useEffect } from 'react';

export const useAxiosGetList = (url, page, refresh, queries) => {
    const [pageObj, setPagesObj] = useState([])
    const [dataPage, setDataPage] = useState([])
    const [errorList, setErrorList] = useState(null)
    const [loadingList, setLoadingList] = useState(false)

    useEffect(() => {
        const getList = async () => {
            setPagesObj([])
            setDataPage([])
            setErrorList(null)
            setLoadingList(true)
            let query = ""
            if (queries.length > 0) {
                query = await processQueries(queries)
            }
            let urlApi = url
            if (page > 0) {
                urlApi = `${url}/${page}`
            }
            await axios.get(`${urlApi}${query}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                }
            }).then(res => {
                if (res.data.status === 200) {

                    if (res.data.body.data) {
                        if (res.data.body.data.length > 0) {
                            setDataPage(res.data.body.data)
                            setPagesObj(res.data.body.pagesObj)
                        } else {
                            setErrorList("No hay datos para mostrar")
                        }
                    } else {
                        setDataPage(res.data.body)
                    }
                } else {
                    setErrorList("No hay datos para mostrar")
                }
            }).catch(error => {
                setErrorList(error.message)
            }).finally(() => setLoadingList(false))
        }
        if (url) {
            getList()
        } else {
            setLoadingList(false)
        }
        // eslint-disable-next-line
    }, [page, url, refresh])

    return { pageObj, dataPage, errorList, loadingList }
}