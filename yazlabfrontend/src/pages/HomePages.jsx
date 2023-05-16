import React, { createContext , useState , useEffect} from 'react'
import axios from 'axios';
import { BASE_URL } from '../config';
import { Form , Button , Spinner , Alert , Tooltip } from 'reactstrap';
import { GrFormAdd } from "react-icons/gr";
import $ from 'jquery';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import TableComponent from '../components/TableComponent';
import AppbarComponent from '../components/AppbarComponent';

export const HomeContext = createContext()

const MySwal = withReactContent(Swal)



const HomePages = (args) => {

    const [dizi , setDizi] = useState([]);

    const [loading ,setLoading] = useState(true)

    const [ekleprocessing , setEkleprocessing] = useState(false)

    const [kaydetprocessing , setKaydetprocessing] = useState(false)

    const [silprocessing , setSilprocessing] = useState(false)

    const [alertvisible , setAlertvisible] = useState(false)

    const [post , setPost] = useState()

    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggle = () => setTooltipOpen(!tooltipOpen);

    const savesentences = (event) => {
      event.preventDefault();
      console.log(event.target.id);

      var textid = '#' + $('#'+event.target.id).parent().parent().children("textarea")[0].id;

      var buttonid = '#' +  event.target.id;

      var textval = $(textid).val();

      console.log('id = ' + textid + ' buttonid = ' + buttonid + ' textval = ' + textval);

      if(textval === ''){
        MySwal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Lütfen İlgili Boşlukları Doldurunuz',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        $(textid).prop('disabled', true);
        $(buttonid).prop('disabled', true);
      }


      
    }

    const removesentences = (event) => {

      MySwal.fire({
        title: 'İnputu kaldırmak istediğinize emin misiniz?',
        showCancelButton: true,
        confirmButtonText: 'Kaldır',
        cancelButtonText: `İptal`,
      }).then((result) => {
        if (result.isConfirmed) {
          $('#' + $("#" + event.target.id).closest('.form-group').attr('id')).remove();
          MySwal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Kaldırıldı',
            showConfirmButton: false,
            timer: 1500
          })
        } 
      })
    }

    const addformelement = () => {
      

      var deger = $("textarea.cumle").length + 1;

      var str1 = '<div class="form-group" id="div'+deger+'"><label for="cumle'+deger+'" class="px-1 fw-bold">'+deger+'. Cümle</label><textarea class="form-control cumle" id="cumle'+deger+'" rows="2" style="font-size:13px;" required></textarea>';
    

      var str2 = '<div class="text-center"><button type="button" class="btn btn-info btn-sm mx-1 my-2 eklebutton" id="button'+deger+'">'+deger+'. Cümleyi Ekle</button><button type="button" class="btn btn-outline-danger btn-sm kaldirbutton" id="kaldir'+deger+'">Kaldır</button></div></div>';

      $( "#forms" ).append( str1 + str2 );

     
    }


    const kelimeekle = (event) => {
        event.preventDefault();
        setEkleprocessing(true);

        const dizi = [];

        $("#forms textarea").each(function(){
          var input = $(this);

          dizi.push( input.val())
         });


         var playload = {
          dizi:dizi
         }
         console.log(dizi);

         axios.post(`${BASE_URL}/kelime` , JSON.stringify(playload) ,{headers: {'Content-Type': 'application/json'}})
            .then(response => {
                console.log(response.data);
                setPost(response.data)
                setAlertvisible(true)
                setEkleprocessing(false);
            })
            .catch(error => {
                console.log(error);
                setEkleprocessing(false);
                MySwal.fire({
                    icon: 'error',
                    title: 'Hata',
                    text: error.message,
                  })
            });

        
    }


    const kelimeleriKaydet = () => {

        console.log(post);
        MySwal.fire({
            title: 'Kelimeleri Kaydetmek istior musunuz?',
            showDenyButton:true,
            confirmButtonText: 'Kaydet',
            denyButtonText: `İptal`,
          }).then((result) => {
            
            if (result.isConfirmed) {
                setKaydetprocessing(true)

                let json;

                json = JSON.stringify({ birlesen: post.birlesen , list:post.kelimeler.dizi , bool:post.bool , time: (Number(post.time)/1000000000.0).toFixed(7) });
                
                axios.post(`${BASE_URL}/setkelimeler`,json , {
                    headers: {
                      // Overwrite Axios's automatically set Content-Type
                      'Content-Type': 'application/json'
                    }
                  })
                    .then(response => {
                        console.log(response.data);
                        setDizi(response.data.kelimeler)
                        setKaydetprocessing(false);
                        setAlertvisible(false)
                        $("textarea").prop('disabled', false);
                        $("textarea").val('');
                        $("button").prop('disabled', false);
                        MySwal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Kelimeler Kaydedildi',
                            showConfirmButton: false,
                            timer: 1500
                          })
                    })
                    .catch(error => {
                        console.log(error);
                        setKaydetprocessing(false);
                        MySwal.fire({
                            position: 'top-end',
                            icon: 'error',
                            title: error.message,
                            showConfirmButton: false,
                            timer: 1500
                          })
                    });
            } else if (result.isDenied) {
                MySwal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: "Kaydedilmedi",
                    showConfirmButton: false,
                    timer: 1500
                  })
            }
          })

        
    }

    const kelimeleriSil = () => {

        if(dizi.length === 0){
            MySwal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Tablo Boş',
                showConfirmButton: false,
                timer: 1500
              })
        }else{
            MySwal.fire({
                title: 'Emin Misin?',
                text: "Yaptığın Değişiklikler Geri Alınamaz!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Evet Hepsini Sil!',
                cancelButtonText:"İptal"
              }).then((result) => {
                if (result.isConfirmed) {
                    setSilprocessing(true)
    
                    axios.post(`${BASE_URL}/deletekelimeler`)
                        .then(response => {
                            console.log(response.data);
                            setDizi(response.data.kelimeler)
                            setSilprocessing(false);
                            MySwal.fire({
                                position: 'top-end',
                                icon: 'success',
                                title: 'Kelimeler Silindi',
                                showConfirmButton: false,
                                timer: 1500
                              })
                        })
                        .catch(error => {
                            console.log(error);
                            setSilprocessing(false);
                            MySwal.fire({
                                position: 'top-end',
                                icon: 'error',
                                title: error.message,
                                showConfirmButton: false,
                                timer: 1500
                              })
                        });
                }
              })
        }

       
        
    }

    const firstloading = () => {
        axios.get(`${BASE_URL}/getkelimeler`)
            .then(response => {
                console.log(response.data);
                setDizi(response.data.kelimeler)
                setLoading(false)
            })
            .catch(error => {
                console.log(error);
            });
    }

    $(".eklebutton").on("click", savesentences);

    $(".kaldirbutton").on("click", removesentences);
    

    useEffect(() => {
        try {
            firstloading();
        } catch (error) {
            console.log(error);
        }
    },[])

  return (
    <HomeContext.Provider value={{dizi , loading}}>
      
         <AppbarComponent />
        <div  className="container fs-6">
          
          
        <div className="d-flex justify-content-between align-items-stretch">
        <h4 className='text-danger'>Cümleler</h4>
        <Button
          color="warning"
          size="sm"
          id="TooltipExample"
          onClick={addformelement}
        >
          <GrFormAdd />
        </Button>

       
        </div>
        <Tooltip
          {...args}
          isOpen={tooltipOpen}
          target="TooltipExample"
          toggle={toggle}
        >
          Cümle Girişi Ekle
        </Tooltip>

        <hr />
         <Form onSubmit={kelimeekle}>  
          <div id='forms'>
            

            <div className="form-group">
              <label htmlFor="cumle1" className='px-1 fw-bold'>1. Cümle</label>
              <textarea className="form-control cumle" id="cumle1" rows="2" style={{fontSize:13}} required></textarea>
              <div className='text-center'>
                <button type="button" className="btn btn-info btn-sm my-2 eklebutton" id='button1'>1. Cümleyi Ekle</button>
              </div>
              
            </div>
            <div className="form-group" id='div2'>
              <label htmlFor="cumle2" className='px-1 fw-bold'>2. Cümle</label>
              <textarea className="form-control cumle" id="cumle2" rows="2" style={{fontSize:13}} required></textarea>
              <div className='text-center'>
                <button type="button" className="btn btn-info btn-sm my-1 eklebutton" id='button2'>2. Cümleyi Ekle</button>
                {' '}
                <button type="button" className="btn btn-outline-danger btn-sm my-2 kaldirbutton" id="kaldir2">Kaldır</button>
              </div>
              
            </div>
            
            
          </div>
          <div className='d-flex flex-column'>
            <button type="submit" className='btn btn-success' style={{fontSize:14}} disabled={ekleprocessing}>
            {
                ekleprocessing ? <Spinner
                style={{ width: "0.7rem", height: "0.7rem" }}
                type="grow"
                color="light"
              /> : null 
            }
            {
                ekleprocessing ? ' Birleştiriliyor' : 'Cümleleri Birleştir'
            }
            </button>
          </div>
          
        </Form>

    <div  className='border text-left mt-2'>
    <Alert isOpen={alertvisible} color='light'>
        <h4 className="alert-heading text-center">
            Cümleleri Birleştir
        </h4>
        
        <hr />

        <h5>Girilen Cümleler</h5>
        {
          !post ? null : post.kelimeler.dizi.map(function(item,i){
            return <p key={'donenkelimeler' + i}>{(i+1) + ' - ' + item}</p>
          })
        }
        <p>
          <b>Birleşen Cümle = </b> {post ? post.birlesen : ''}
        </p>
        <p>
          <b>işlem Süresi = </b> {post ? (Number(post.time)/1000000000.0).toFixed(7) : ''}
        </p>
        <p>
          <b>Birleştirilir mi = </b> {!post ?  '' : post.bool ? 'Evet' : 'Hayır'}
        </p>
        <p>
          <b>Not = </b> {!post ?  '' : post.message}
        </p>
        <Button color='success' disabled={kaydetprocessing} onClick={kelimeleriKaydet} className='fs-6 m-1'>
            {
                kaydetprocessing ? <Spinner
                style={{ width: "0.7rem", height: "0.7rem" }}
                type="grow"
                color="light"
              /> : null 
            }
            {
                kaydetprocessing ? ' Kaydediliyor' : 'Kelimeleri Kaydet'
            }
        </Button>
        <Button color="danger" outline onClick={() => {setAlertvisible(false); $("textarea").prop('disabled', false);
                        $("textarea").val('');
                        $("button").prop('disabled', false);}} className='fs-6 m-1'>
            İptal
        </Button>
        </Alert>
        
    </div>
        
            <br />
        
            <div className="d-flex justify-content-between align-items-center py-1">
            <h6 className='text-dark text-center align-self-center'>Kayıtlı Birleşik Cümleler</h6>
            <Button color='danger' disabled={silprocessing} onClick={kelimeleriSil} size='sm'>
            {
                silprocessing ? <Spinner
                style={{ width: "0.5rem", height: "0.5rem" }}
                type="grow"
                color="light"
              /> : null 
            }
            {
                silprocessing ? ' Siliniyor' : 'Tabloyu Temizle'
            }
        </Button>
          </div>
        <TableComponent dizi={dizi} loading={loading}/>
        
    </div>
    </HomeContext.Provider>
    
  )
}

export default HomePages
