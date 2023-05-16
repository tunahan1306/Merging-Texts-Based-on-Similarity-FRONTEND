import React from 'react';
import { Spinner , Table } from 'reactstrap';
import { AiOutlineCheck } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";






const TableComponent = ({dizi , loading}) => {
    

  return (
    <>
    <Table
        bordered
        hover
        responsive
        size="sm"
        striped
        className='text-center align-middle'
        >
            
            
        <thead className="table-dark">
            <tr>
            <th>
                #
            </th>
            <th>
                Gelen Cümleler
            </th>
            <th>
                Birleşen Cümle
            </th>
            <th>
                Durum
            </th>
            <th>
                Süre
            </th>
            <th>
                Oluşturma
            </th>
            <th>
                Güncelleme
            </th>
            </tr>
        </thead>
        <tbody>
        {
            loading ?  <tr><td colSpan="7"> <Spinner type="border" color="primary" /></td></tr>: 
            
                
                    dizi.length === 0 ? <tr><td colSpan={7}>Tablo Boş</td></tr>
                     : 
                     dizi.map(function(item , i){

                        return <tr key={item.id}>
                        <td>
                            {i+1}
                        </td>
                        <td>
                            {
                                item.list ? 
                                item.list.map(function(cos , x){
                                    return <p key={'tcumle' + x}>{cos}</p> ;
                                }) : ''
                            }
                        </td>
                        <td>
                            {item.birlesen === '' ? '-' : item.birlesen}
                        </td>
                        <td>
                            {item.bool ? <AiOutlineCheck style={{color:'green'}} /> : <RxCross2 style={{color:'red'}} />}
                        </td>
                        <td>
                            {item.time ? item.time + " sn" : ''}
                        </td>
                        <td>
                            {(new Date(item.createdAt)).toLocaleString() }
                        </td>
                        <td>
                            {(new Date(item.updatedAt)).toLocaleString() }
                        </td>
                        </tr>
                    })
                    
                    
                
                
            
            
        }
        </tbody>
        </Table>

       
       
    </>
    
  )
}

export default TableComponent
