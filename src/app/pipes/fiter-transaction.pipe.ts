import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fiterTransaction'
})
export class FiterTransactionPipe implements PipeTransform {

  transform(transactionArray:any[],searchKey:string,propertyname:string): any[] {
    const result:any=[]
    if(!transactionArray || searchKey=="" || propertyname==""){
      return transactionArray
    }
    transactionArray.forEach((item:any)=>{
      if(item[propertyname].trim().toLowerCase().includes(searchKey.trim().toLowerCase())){
        result.push(item)
      }
    })

    return result;
  }

}
