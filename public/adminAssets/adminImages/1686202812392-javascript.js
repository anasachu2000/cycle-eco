///////// array methodes ////////

//-----PUSH-----//

// let array = [1,8,2,3,7];
// array.push(7);
// console.log(array);

//-----POP-----//

// array.pop();
// console.log(array);

//-----SHIFT-----//

// array.shift();
// console.log(array);

//-----UNSHIFT-----//

// array.unshift(9);
// console.log(array);

//-----REVERCE-----//
// array.reverse();
// console.log(array);

//-----SLICE-----//
// let v = array.slice(2,3);
// console.log(v)

//-----SPLICE-----//
// array.splice(1,0);
// console.log(array);

//-----JOIN-----//
// let v = array.join('');
// console.log(v);

//-----AT-----//
// let v = array.at(3);
// console.log(v);

//-----FILL-----//
// array.fill(0);
// console.log(array);

//-----MAP-----//
// let v = array.map((item)=>{
//     return item*2
// })
// console.log(v);

//-----FILTER-----//
// let v = array.filter((item)=>{
//     return item > 6
// })
// console.log(v);

//-----FIND-----//
// let v = array.find((item)=>{
//     return item  > 6
// })
// console.log(v);

//-----REDUCE-----//
// let v = array.reduce((prev,cur)=>{
//     return prev+cur
// })
// console.log(v);

//-----SPRED-----//
// let v = [...array]
// console.log(v);





///////// OBJECT methodes ////////

// let object = {
//     name:'anas',
//     age:20,
//     place:"wayanad",
//     job:"mern stack",
// }
// console.log(object);

///////// ARRAY OBJECT ///////////

// let object = [{
//     name:'anas',
//     age:20,
//     place:"wayanad",
//     job:"mern stack",
// },{
//     name:'minhaj',
//     age:30,
//     place:'vadakara',
//     job:'mern stack'
// }
// ]

// let v = object.map((value)=>{
//     return value.name
// })

// console.log(v);

// let v = object.find((value)=>{
//     return value.age > 20
// })
// console.log(v);





///////// clousher ///////////

// function sum(){
//     let a = 10;
//     let b = 20;
//     function result(){
//         let c = 20
//         console.log(a+c+b);
//     }result();
// }
// sum();


/////// PROMISE /////////

// let n = 5;

// let promise = new Promise((res,rej)=>{
//     if(n == 1){
//         res("the result is true");
//     }else{
//         rej("error")
//     }
// })
// promise.then((res)=>{
//     console.log(res);
// }).catch((error)=>{
//     console.log(error);
// }).finally(()=>{
//     console.log('must printed item');
// })


///////// ASYNC AWAIT ///////

// let promise = new Promise((res,rej)=>{
//     let n = 5;
//     if(n % 2 == 0){
//         res('is even');
//     }else{
//         rej('is odd');
//     }
// })
// const fetchData = async(res,rej)=>{
//     try{
//         let res = await promise
//         console.log(res);
//     }catch(error){
//         console.log(error);
//     }
// }
// fetchData();

//////// SETTIMEOUT IN PROMISE //////////

// let promise = new Promise((res,rej)=>{
//     let n = 5;
//     setTimeout(()=>{
//         if(n % 2 == 0){
//             res('is even');
//         }else{
//             rej('is odd');
//         }
//     },3000)
   
// })
// const fetchData = async(res,rej)=>{
//     try{
//         let res = await promise
//         console.log(res);
//     }catch(error){
//         console.log(error);
//     }
// }
// fetchData();


////////// FUNCTION DEFANITION  ////////////

// function sum(a,b){
//     return a+b;
// }


////////// FUNCTION EXPRESS  ////////////

// let add = function(a,b){
//     return a+b;
// }




////---------- DATA STUCTURE FIRST WEEK -----------//////

//////////// LIKED LIST ////////////

// class Node{
//     constructor(data,next){
//         this.data = data;
//         this.next = next;
//     }
// }
// class linkedLIst{
//     constructor(){
//         this.head = null;
//     }
//     insertFirst(data){
//         let node = new Node(data,this.head)
//         if(this.head == null){
//             this.head = node;
//         }else{
//             node.next = this.head;
//             this.head = node
//         }
//     }
//     deleteFirst(){
//         if(this.head == null){
//             console.log('empty');
//         }else{
//             this.head = this.head.next
//         }
//     }
//     display(){
//         if(this.head == null){
//             console.log('empty');
//         }else{
//             let temp = this.head;
//             while(temp){
//                 console.log(temp.data);
//                 temp = temp.next
//             }
//         }
//     }
// }
// let v = new linkedLIst()
// v.insertFirst(10)
// v.insertFirst(20)
// v.insertFirst(30)
// v.deleteFirst()
// v.display()


//////////// LINER SEARCH ////////////

// let array = [9,8,3,7,5,6,7]
// let find = 8
// function linerSearch(find,a){
//     for(let i = 0;i < array.length;i++ ){
//         if(array[i] === find){
//             return true
//         }  
//     }
//     return false
// }
// console.log(linerSearch(find,a));


//////////// BINARY SEARCH ////////////

// let array = [1,2,3,4,5,6,7,8,9];
// let target = 2;
// function binarySearch(array,target){
//     let l = 0;
//     let r = array.length-1
//     while(l<=r){
//         let m = Math.floor((l+r)/2);
//         if(target == array[m]){
//             return m;
//         }
//         if(target < array[m]){
//             r = m - 1;
//         }
//         else{
//             l = m + 1;
//         }
//     }
//     return false
// }
// console.log(binarySearch(array,target))




////---------- DATA STUCTURE SECOND WEEK -----------//////

//////////// SELECTION SORT ////////////

// let array = [2,9,7,6,4,5]
// function selectioSort(array){
//     let temp =0
//     for(let i = 0;i < array.length-1;i++){
//         for(let j = i + 1;j < array.length;j++){
//             if(array[j] < array[i]){
//                 temp = array[j];
//                 array[j] = array[i];
//                 array[i] = temp;
//             }
//         }
//     }
//     console.log(array)
// }
// selectioSort(array)

//////////// BUBBLE SORT ////////////

// array = [1,8,4,9,3,7]
// function bubbleSort(array){
//     for(let i = 0; i < array.length - 1; i++){
//         let flag = 0
//         for(let j = 0; j < array.length - 1; j++){
//             if(array[j] > array[j + 1]){
//                 temp = array[j]
//                 array[j] = array[j + 1]
//                 array[j + 1] = temp
//                 flag = 1
//             }
//         }
//         if(flag == 0){
//             break
//         }
//     }
//     return array
// }
// console.log(bubbleSort(array))

//////////// INSERTION SORT ////////////

// let array = [5,4,8,7,9,2,4,1];
// function insertionsort(arr){
//     for(var i=1;i<arr.length;i++){
//         var curr=arr[i]
//         var j=i-1
//         while(j>=0 && arr[j]>curr){
//             arr[j+1]=arr[j]
//             j--
//         }
//         arr[j+1]=curr
//     }
//     return arr
// }
// console.log(insertionsort(array));

//////////// MERGE SORT ////////////

// let array = [1,8,3,7,2,9,5,4]
// let lb = 0
// let ub = array.length-1
// function mergeSort(array,lb,ub){
//     if(lb < ub){
//     let mid = Math.floor((lb + ub)/2)
//     mergeSort(array,lb,mid)
//     mergeSort(array,mid + 1,ub)
//     merge(array,lb,mid,ub)
//     }
//     return array

// }
// function merge(array,lb,mid,ub){
//         let i = lb
//         let j = mid + 1
//         let k = lb
//         let b = []
//         while(i <= mid && j <= ub){
//             if(array[i] <= array[j]){
//                 b[k] = array[i]
//                 i++
//             }else{
//                 b[k] = array[j]
//                 j++
//             }
//             k++
//         }
//         if(i > mid){
//             while(j <= ub){
//                 b[k] = array[j]
//                 j++
//                 k++
//             }
//         }else{
//             while(i <= mid){
//                 b[k] = array[i]
//                 i++
//                 k++
//             }
//         }
//         for( k = lb; k <= ub; k++){
//             array[k] = b[k]
//         }
//     }
// console.log(mergeSort(array,lb,ub));


////---------- DATA STUCTURE THERD WEEK -----------//////

//////////// BINARY SEARCH TREE ////////////

// class Node{
//     constructor(data){
//         this.data = data;
//         this.left = null;
//         this.right = null;
//     }
// }

// class binaryTree{
//     constructor(){
//         this.root = null
//     }
//     insert(data){
//         let node = new Node(data)
        
//         if(this.root == null){
//             this.root = node;
//             return;
//         }
//         let temp = this.root;
//         while(true){
//             if(data < temp.data ){
//                 if(temp.left == null){
//                     temp.left = node;
//                     return;
//                 }
                
//                 temp = temp.left;
//             } else {
//                 if(temp.right == null){
//                     temp.right = node;
//                     return;
//                 }
                
//                 temp = temp.right;
//             }
//         }
//     }
    
//     inorder(){
//         this.inhelper(this.root);
//     }
    
//     inhelper(node){
//         if(node!=null){
//             this.inhelper(node.left);
//             console.log(node.data);
//             this.inhelper(node.right);
//         }
//     }
// }

// let v = new binaryTree();
// v.insert(10);
// v.insert(20);
// v.insert(30);
// v.inorder();





class Node{
    constructor(data){
        this.data = data;
        this.left = null;
        this.right = null;
    }
}
class binarySearch{
    constructor(){
        this.root = null
    }
    insert(data){
        let node = new Node(data)
        if(this.root == null){
            this.root = node
            return
        }
        let temp = this.root
        while(true){
            if(data < temp.data){
                if(temp.left == null){
                    temp.left = node
                    return
                }
                temp = temp.left
            }else{
                if(temp.right == null){
                    this.right = node
                    return
                }
                temp = temp.right
            }
        }
    }
    inorder(){
        this.inhelper(this.root)
    }
    inhelper(node){
        if(node != null){
            this.inhelper(node.left)
            console.log(node.data)
            this.inhelper(node.right)
        }
    }
}
let n = new binarySearch()
n.insert(10)
n.insert(20)
n.insert(30)
n.inorder()



setInterval