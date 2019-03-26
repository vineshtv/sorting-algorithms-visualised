var arr = [];
var sortHistory = [];
var completed = false;
var sorted = false;
var sortAlgo = 'bubble';
//var sortAlgo = 'bitsort';
var comps = 0;

function setup() {
    createCanvas(800, 400);
    background(0);

    // Create the array
    resetArray();
    //frameRate(5);
}

function resetArray() {
    var val = 0;
    /*
    for (var i = 0; i < width; i++){
        arr[i] = val;
        val = val + 0.5;
    }
    */

    for(var i = 0; i < width/2; i++) {
        arr[i] = i;
    }

    //Randomise the array
    arr = shuffle(arr);
    sortHistory = [];
    comps = 0;
    sorted = false;
}

function swap(arr, i, j){
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

function bubbleSort(){
    for(var i = 0; i < arr.length - 1; i++){
        for(var j = 0; j < arr.length - i - 1; j++) {
            comps++;
            if (arr[j] > arr[j + 1]){
                swap(arr, j, j + 1);
            }
            if(comps % 25 == 0){
                sortHistory.push(arr.slice());
            }
        }
        sortHistory.push(arr.slice());
    }

    sorted = true;
    console.log('Total comparisons: ', comps);
} 

function insertionSort() {
    for (var i = 1; i < arr.length; i++) {
        var key = arr[i];
        j = i - 1;

        while(j >= 0 && arr[j] > key) {
            comps++;

            arr[j + 1] = arr[j];
            j = j - 1;
            if (comps % 25 == 0){
                sortHistory.push(arr.slice());
            }
        }
        arr[j + 1] = key;
        sortHistory.push(arr.slice());
    }

    sorted = true;
    console.log('Total comparisons: ', comps);
}

function selectionSort() {
    for (var i = 0; i < arr.length - 1; i++) {
        var min_idx = i;
        for(var j = i + 1; j < arr.length; j++) {
            comps++;
            if(arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        swap(arr, min_idx, i);
        sortHistory.push(arr.slice());
    }

    sorted = true;
    console.log('Total comparisons: ', comps);
}

function merge1(l, m , r) {
    var n1 = m - l + 1;
    var n2 = r - m;

    var L = [];
    var R = [];

    for (var i = 0; i < n1; i++) {
        L[i] = arr[l + i];
    }
    for (var j = 0; j < n2; j++) {
        R[j] = arr[m + 1 + j];
    }

    var i = 0;
    var j = 0;
    var k = l;
    while(i < n1 && j < n2){
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
        sortHistory.push(arr.slice());
    }

    //Copy remaining.
    while(i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    while(j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
    sortHistory.push(arr.slice());
}

function merge(start, mid, end) {
    var start2 = mid + 1;

    if(arr[mid] <= arr[start2]) {
        return;
    }

    while(start <= mid && start2 <= end){
        if(arr[start] <= arr[start2]){
            start++;
        } else {
            var value = arr[start2];
            var index = start2;

            while(index != start){
                comps++;
                arr[index] = arr[index - 1];
                index--;

                if(comps % 25 == 0){
                    sortHistory.push(arr.slice());
                }
            }

            arr[start] = value;
            sortHistory.push(arr.slice());

            start++;
            mid++;
            start2++;
        }
    }
    sortHistory.push(arr.slice());
}

function mergeSort(l, r) {
    if (l < r) {
        var m = l + floor((r - l)/2);

        mergeSort(l, m);
        mergeSort(m + 1, r);

        merge(l, m , r);
        //sortHistory.push(arr.slice());
    }
}

function partition1(low, high) {
    var pivot = arr[high];
    var i = (low - 1);

    for (var j = low; j <= high - 1; j++) {
        if(arr[j] <= pivot){
            i++;
            swap(arr, i, j);
        }
    }
    swap(arr, i + 1, high);
    return (i + 1);
}

function partition(low, high) {
    var pivot = arr[high];
    var i = low;
    var j = high - 1;

    while(i <= j){
        if(arr[i] > pivot) {
            swap(arr, i, j);
            j--;
        } else {
            i++;
        }
        sortHistory.push(arr.slice());
    }

    swap(arr, i, high);
    sortHistory.push(arr.slice());
    return(i);
}

function quicksort(low, high) {
    if (low < high) {
        var pi = partition(low, high);

        quicksort(low, pi - 1);
        quicksort(pi + 1, high);
    }
}

function heapify(n, i) {
    var largest = i;
    var l = 2 * i + 1;
    var r = 2 * i + 2;

    if(l < n && arr[l] > arr[largest]){
        largest = l;
    }

    if(r < n && arr[r] > arr[largest]){
        largest = r;
    }

    if (largest != i){
        swap(arr, i, largest);
        sortHistory.push(arr.slice());

        heapify(n, largest);
    }
}

function heapsort(){
    var n = arr.length;
    for(var i = floor(n /2) - 1; i >= 0; i--){
        heapify(n, i);
    }

    for(var i = n - 1; i >= 0; i--){
        swap(arr, 0, i);
        sortHistory.push(arr.slice());
        
        heapify(i, 0);
    }
}

function bitsortPartition(low, high, msbBitPos) {
    var mask = ~(1 << (msbBitPos - 1));
    var i = low;
    var j = high;

    while (i < j){
        while((arr[i] | mask) == mask){
            i++;
            if (i > high){
                break;
            }
        }

        while((arr[j] | mask) != mask){
            j--;
            if(j < low){
                break;
            }
        }

        if (i <= j){
            swap(arr, i, j);
            sortHistory.push(arr.slice());
        }
    }

    return i - 1;
}

function bitsort(low, high, msbBitPos){
    if(msbBitPos == 0) {
        return;
    }

    if(low < high) {
        var x = bitsortPartition(low, high, msbBitPos);

        bitsort(low, x, msbBitPos - 1);
        bitsort(x + 1, high, msbBitPos - 1);
    }
}

function draw() {
    background(0);
    stroke(200);

    if (sorted == false){
        if(sortAlgo == 'bubble'){
            console.log('Bubble sort');
            bubbleSort();
        } else if (sortAlgo == 'insertion'){
            console.log('Insertion sort');
            insertionSort();
        } else if (sortAlgo == 'selection') {
            console.log('Selection Sort');
            selectionSort();
        } else if (sortAlgo == 'merge') {
            console.log('Merge Sort');
            console.log(arr);
            mergeSort(0, arr.length - 1);
            sortHistory.push(arr.slice());
            sorted = true;
            console.log(sortHistory.length);
            console.log(arr);
        } else if (sortAlgo == 'quicksort') {
            console.log('Quicksort');
            quicksort(0, arr.length - 1);
            sortHistory.push(arr.slice());
            sorted = true;
        } else if (sortAlgo == 'heapsort') {
            console.log('Heapsort');
            heapsort();
            sortHistory.push(arr.slice());
            sorted = true;
        } else if (sortAlgo == 'bitsort') {
            bitsort(0, arr.length - 1, 9);
            sortHistory.push(arr.slice());
            sorted = true;
        }
    } else {
        var drawArr = sortHistory[0];
        sortHistory.splice(0, 1);
        for(var i = 0; i < drawArr.length; i++){
            line(i * 2, height - drawArr[i], i * 2, height)
            //line(i, height - drawArr[i], i, height)
        }
        if (sortHistory.length == 0) {
            completed = true;
        }
    }

    if (completed == true) {
        //noLoop();
        if(sortAlgo == 'bubble') {
            sortAlgo = 'insertion';
        } else if (sortAlgo == 'insertion') {
            sortAlgo = 'selection';
        } else if (sortAlgo == 'selection') {
            sortAlgo = 'merge';
        } else if (sortAlgo == 'merge') {
            sortAlgo = 'quicksort';
        } else if (sortAlgo == 'quicksort') {
            sortAlgo = 'heapsort';
        } else if (sortAlgo == 'heapsort') {
            sortAlgo = 'bitsort';
        } else if (sortAlgo == 'bitsort'){
            noLoop();
        }

        resetArray();
        completed = false;
    }
    /*
    for(var i = 0; i < arr.length; i++){
        line(i, height - arr[i], i, height);
    }
    */
}
