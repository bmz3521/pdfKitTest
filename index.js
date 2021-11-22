const express = require('express')
const app = express()
const pdfGenerator = require('pdfkit')

const fs = require('fs')
const codes = require('rescode')
// instantiate the library
// let theOutput = new pdfGenerator
codes.loadModules(['code128'], { includetext:false})


// pipe to a writable stream which would save the result into the same directory
const qrcode = require('qrcode')
// --------- QRCODE GENERATOR ---------------
const accountNumber = '|099400016602811'
const HN = '370086811'
const VN = '640337789'
const amount = '10000' // 10000 = 100.00 Bath


const codeBarCode = `${accountNumber} ${HN} ${VN} ${amount}`;
const dataEan8 = codes.create('code128', codeBarCode)


const codePayment = `${accountNumber} 
${HN}
${VN}
${amount}`; // จำเป็นต้องเว้นบรรทัดแบบนี้ครับ  ACCOUNTNUMBER HN VN AMOUNT ต้องแยกกัน

qrcode.toFile('QrPaymeny/result.jpg', codePayment, {
    color: {
        dark: '#000000',
        light: '#ffffff',
    }
  }, function (err) {
    if (err) throw err
    console.log('done')
  })
// --------- QRCODE GENERATOR ---------------




let data = '[ INSERT ]'
const generateHeaders = (doc) =>  {
        doc
            .image('./logo/logo.png', (doc.page.width - 100) / 2, 30, { width: 100 , } )
            .font('font/THSarabun Bold.ttf')
            .fillColor('#000')
            .fontSize(17)
            .text('ใบแจ้งชำระค่าบริการ', (doc.page.width - 100) / 2, 120)
            .moveDown()
        doc
            .font('font/THSarabun.ttf')
            .fontSize(14)
            .text('คณะแพทย์ศาตร์วชิรพยาบาล มหาวิทยาลัยนวมินทราธิราช', 60, 160)  
            .text('681 ถนนสามเสน แขวงวชิรพยาบาล เขตดุสิต กรุงเทพมหานคร 10300', 60, 175) 
            .text('เลขประจำตัวผู้เสียภาษีอากร (Tax ID): 0994000166028', 60, 195) 
        doc
            .font('font/THSarabun Bold.ttf')
            .fontSize(14)
            .text(`Customer No.(Ref No.1) : ${data}`, 360, 160)  
            .text(`Reference No.(Ref No.2) : ${data}`, 360, 175) 
        doc 
            .font('font/THSarabun.ttf')
            .fontSize(14)
            .text(`วันที่แจ้งค่าบริการ : ${data}`, 360, 195)
        
        doc.rect(50, 150, 500, 75).stroke();

    }

const generateInfo = (doc) => {
    doc
    .font('font/THSarabun.ttf')
    .fontSize(14)
    .text(`ชื่อ-นามสกุล (ผู้ป่วย) ${data}`, 70, 240)   
    .text(`ที่อยู่ ${data}`, 70, 260) 
}
const generateTable = (doc) =>  {
    const tableTop = 330
    const itemCodeX = 120
    const descriptionX = 200
    const quantityX = 310
    const priceX = 450
    doc
            .font('font/THSarabun Bold.ttf')
            .fontSize(15)
            .text('รายการค่าใช้่จ่ายที่ต้องชำระ', (doc.page.width - 100) / 2, 300)
            .moveDown()
    doc
        .font('font/THSarabun.ttf')
        .fontSize(14)
        .text('วันที่', itemCodeX, tableTop)
        .text('เวลา', descriptionX, tableTop)
        .text('รายการค่าใช้จ่าย', quantityX, tableTop)
        .text('จำนวนเงิน (บาท)', priceX, tableTop)

        const items = [
            {
                title : 'ค่าบริการผู้ป่วยนอก (ในเวลาราชการ)',
                price : '50.00',
                date : '30/08/2564',
                time : '13:35:20'
            },
            {
                title : 'ค่าตรวจรักษาทางรังสีวิทยา',
                price : '2560.00',
                date : '30/08/2564',
                time : '14:02:37'
            }
        ]
        let i = 0
    
    
        for (i = 0; i < items.length; i++) {
            const item = items[i]
            const y = tableTop + 25 + (i * 25)
    
            doc
                .fontSize(14)
                .text(item.date, 100, y)
                .text(item.time, 180, y)
                .text(item.title, 270, y)
                .text(item.price, 420, y,{width: 110,align: 'right'})
        }
}

const generateFooter = (doc) => {
    const textFooter = 'ช่องทางการชำระเงินด้วยการสแกนคิวอาร์โค้ดหรือบาร์โค้ด ผ่านทางโมบายแอปพลิเคชัน'
    const textBelowFooter = 'เคาน์เตอร์ธนาคารกรุงไทย / ตู้เอทีเอ็มธนาคารกรุงไทย'
    const insert = '[ INSERT ]'
    const pathQrCode = './QrPaymeny/result.jpg'
        doc
            // .font('font/code128.ttf')
            // .fontSize(30)
            doc.image(dataEan8,  230, doc.page.height - 170, {height:30, width:340})
            .font('font/THSarabun.ttf')
            .fontSize(16)
            .text(codeBarCode, 280, doc.page.height - 140)
            .rect(225, doc.page.height - 175, 350,55).stroke();
        doc
            .image(pathQrCode, 60, doc.page.height - 180, { width: 140 , } )
            .rect(65, doc.page.height - 175, 130, 130).stroke();
        
        doc
            .font('font/THSarabun.ttf')
            .fontSize(16)
            .text(`Company Code : ${insert}`, 430, doc.page.height - 120)
        doc
            .font('font/THSarabun.ttf')
            .fontSize(14)
            .text(textFooter, 230, doc.page.height - 90)
        doc
        .font('font/THSarabun.ttf')
        .fontSize(14)
        .text(textBelowFooter, 230, doc.page.height - 70)
}

const generate = (doc) =>  {
    let theOutput = new pdfGenerator({size: 'A4',margins: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }})

    

    const fileName = `./pdf/TestDocument.pdf`

    // pipe to a writable stream which would save the result into the same directory
    theOutput.pipe(fs.createWriteStream(fileName))

    generateHeaders(theOutput)

    generateInfo(theOutput)

    theOutput.moveDown()

    generateTable(theOutput)

    generateFooter(theOutput)
    

    // write out file
    theOutput.end()

}



app.get('/pdf', (req, res) => {
    generate()
})

app.get('/show_file', (req, res) => {
     generate()
    const path = './pdf/TestDocument.pdf'
    if (fs.existsSync(path)) {
        res.contentType("application/pdf");
        fs.createReadStream(path).pipe(res)
    } else {
        res.status(500)
        console.log('File not found')
        res.send('File not found')
    }
})


app.get('/', (req, res) => {
  res.json({ message: 'Ahoy!' })
})
app.listen(9000, () => {
  console.log('Application is running on port 9000')
})