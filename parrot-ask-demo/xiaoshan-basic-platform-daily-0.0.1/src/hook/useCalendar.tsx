import GT from 'types';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import useMoment from './useMoment';
interface CalendarCell {
  date: moment.Moment;
  events: GT.Model.CalendarEvent[];
}
interface CalendarRow {
  month: number;
  year: number;
  [key: number]: CalendarCell;
}
export default function useCalendar() {
  const { moment } = useMoment();
  const createDateMap = (start: moment.Moment, end: moment.Moment) => {
    const map = new Map<number, CalendarCell>();
    do {
      const day = start.day();
      map.set(moment(start).valueOf(), {
        date: moment(start),
        events: [],
      });
    } while (start.add(1, 'day') <= end);
    return map;
  };
  const createTableData = (data: CalendarCell[]) => {
    const rows: CalendarRow[] = [];
    let current = {} as CalendarRow;
    data.forEach((item, index) => {
      const day = item.date.day();
      current[day] = item;
      current.month = current.month || item.date.month() + 1;
      current.year = current.year || item.date.year();
      if (day === 0 || data.length === index + 1) {
        rows.push(current);
        current = {} as CalendarRow;
      }
    });
    return rows;
  };

  const createPdf = (selector: string, single: boolean = true) => {
    const dom = document.querySelector(`${selector}`) as HTMLElement;
    // if (dom) {
    //   html2canvas(dom).then((canvas) => {
    //     let dataURL = canvas.toDataURL('image/jpeg', 1.0);
    //     const img = new Image();
    //     img.src = dataURL;
    //     img.style.width = '100%';
    //     const newWin = window.open('http://127.0.0.1');
    //     newWin?.document.write(img.outerHTML);

    //     setTimeout(() => {
    //       newWin?.print();
    //     }, 100);
    //   });
    // }
    let contentWidth = dom.clientWidth;
    let contentHeight = dom.clientHeight;
    html2canvas(dom).then((canvas) => {
      let pageData = canvas.toDataURL('image/jpeg', 1.0);
      let pdf;
      console.log(dom, single);
      if (single) {
        let limit = 14400;
        if (contentHeight > limit) {
          let contentScale = limit / contentHeight;
          contentHeight = limit;
          contentWidth = contentScale * contentWidth;
        }
        // orientation Possible values are "portrait" or "landscape" (or shortcuts "p" or "l")
        pdf = new jsPDF.default(contentWidth > contentHeight ? 'l' : 'p', 'pt', [
          contentWidth,
          contentHeight,
        ]); // 下载尺寸 a4 纸 比例
        // pdf.addImage(pageData, 'JPEG', 左，上，宽度，高度)设置
        pdf.addImage(pageData, 'JPEG', 0, 0, contentWidth, contentHeight);
        console.log(pdf.output('datauristring'));
        pdf.output('dataurlnewwindow');
      } else {
        let pageHeight = (contentWidth / 552.28) * 841.89;
        let leftHeight = contentHeight;
        let position = 0;
        let imgWidth = 555.28;
        let imgHeight = (imgWidth / contentWidth) * contentHeight;
        pdf = new jsPDF.default('p', 'pt', 'a4');
        if (leftHeight < pageHeight) {
          pdf.addImage(pageData, 'JPEG', 20, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            pdf.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight);
            leftHeight -= pageHeight;
            position -= 841.89;
            //避免添加空白页
            if (leftHeight > 0) {
              pdf.addPage();
            }
          }
        }
        pdf.setProperties({
          title: 'pdf',
        });
        pdf.output('dataurlnewwindow');
      }
    });
  };
  return {
    createDateMap,
    createTableData,
    createPdf,
  };
}
