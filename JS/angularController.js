
var BankApp = angular.module("MyApp", []);
    BankApp.controller("BankAppController", function ($scope) {
    $scope.list = model;
    $scope.indexOfSelectedRow;
    $scope.selectBank;
    $scope.urlCalculator="calculator.html?"+encodeURIComponent(JSON.stringify($scope.list.banks));

    if(window.location.href.includes("calculator.html")){
        let json=window.location.href.split("?");
        $scope.list.banks=JSON.parse(decodeURIComponent(json[1]));

        if(Number.isInteger(parseInt(json[2]))){
            $scope.indexOfSelectedRow=parseInt(json[2]);
            let ddBanks=document.querySelector("#bankList");
            ddBanks.innerText=$scope.list.banks[$scope.indexOfSelectedRow].bank;
            $scope.selectBank=$scope.list.banks[$scope.indexOfSelectedRow];
        }

        let inp1,inp2;
        inp1=document.querySelector("#formInitialLoan");
        inp2=document.querySelector("#formDownPayment");
        inp1.addEventListener("input",function(){
            if(parseFloat(inp1.value)>$scope.selectBank.MaximumLoan){
                inp1.className+=" border-danger";
            }
            else{ 
                inp1.className= inp1.className.replace(/border-danger/g,'');
                inp2.value=parseFloat(inp1.value)/100*$scope.selectBank.MinimumDownPayment;
            }
        })

    }

    // add Bank
    $scope.addBank = function (bank, InterestRate, MaximumLoan, MinimumDownPayment, LoanTermMin, LoanTermMax) {
        // преобразуем введенное значение к числу
        InterestRate = parseFloat(InterestRate);
        MaximumLoan = parseFloat(MaximumLoan);
        MinimumDownPayment = parseFloat(MinimumDownPayment);
        LoanTermMin = parseFloat(LoanTermMin);
        LoanTermMax = parseFloat(LoanTermMax);
        $scope.list.banks.push({ bank: bank, InterestRate : InterestRate, MaximumLoan: MaximumLoan, MinimumDownPayment : MinimumDownPayment, LoanTermMin: LoanTermMin , LoanTermMax : LoanTermMax });
        $scope.urlCalculator="calculator.html?"+encodeURIComponent(JSON.stringify($scope.list.banks));
    }
    // select row
    $scope.selectRow= function (thisElem){
        removeClasTablePrimary();
        indexOfSelectedRow=thisElem.$index;
    let selRow=document.querySelector("#bankTable").children[1].children[indexOfSelectedRow];
    selRow.className+=" table-primary";
    let el = document.querySelectorAll(".disabled-button-my");
    for (const iterator of el) {
        iterator.disabled=false;
    }
    $scope.urlCalculator="calculator.html?"+encodeURIComponent(JSON.stringify($scope.list.banks))+"?"+indexOfSelectedRow;
    };
    // update data of modal window
    $scope.updateModal=function(){
        let bank=document.querySelector("#formNameOfBankUp");
        let InterestRate=document.querySelector("#formInterestRateUp");
        let MaximumLoan=document.querySelector("#formMaximumLoanUp");
        let MinimumDownPayment=document.querySelector("#formMinimumDownPaymentUp");
        let LoanTermMin=document.querySelector("#formLoanTermMinUp");
        let LoanTermMax=document.querySelector("#formLoanTermMaxUp");
        bank.value =$scope.list.banks[indexOfSelectedRow].bank;
        InterestRate.value =$scope.list.banks[indexOfSelectedRow].InterestRate;
        MaximumLoan.value =$scope.list.banks[indexOfSelectedRow].MaximumLoan;
        MinimumDownPayment.value =$scope.list.banks[indexOfSelectedRow].MinimumDownPayment;
        LoanTermMin.value =$scope.list.banks[indexOfSelectedRow].LoanTermMin;
        LoanTermMax.value =$scope.list.banks[indexOfSelectedRow].LoanTermMax;
    }
    // update data
    $scope.updateData=function(){
        let bank=document.querySelector("#formNameOfBankUp");
        let InterestRate=document.querySelector("#formInterestRateUp");
        let MaximumLoan=document.querySelector("#formMaximumLoanUp");
        let MinimumDownPayment=document.querySelector("#formMinimumDownPaymentUp");
        let LoanTermMin=document.querySelector("#formLoanTermMinUp");
        let LoanTermMax=document.querySelector("#formLoanTermMaxUp");

        $scope.list.banks[indexOfSelectedRow].bank=bank.value;
        $scope.list.banks[indexOfSelectedRow].InterestRate=parseFloat(InterestRate.value);
        $scope.list.banks[indexOfSelectedRow].MaximumLoan=parseFloat(MaximumLoan.value);
        $scope.list.banks[indexOfSelectedRow].MinimumDownPayment=parseFloat(MinimumDownPayment.value);
        $scope.list.banks[indexOfSelectedRow].LoanTermMin=parseFloat(LoanTermMin.value);
        $scope.list.banks[indexOfSelectedRow].LoanTermMax=parseFloat(LoanTermMax.value);
    }
    //delete data
    $scope.deleteData=function(){
        $scope.list.banks.splice(indexOfSelectedRow,1);
    if ($scope.list.banks.length<=0) {
    let el = document.querySelectorAll(".disabled-button-my");
    for (const iterator of el) {
        iterator.disabled=true;
        }
    } 
    
    }
    // select Drop Down Item
    $scope.selectDropDownItem=function(thisItem){
        let ddBanks=document.querySelector("#bankList");
        ddBanks.innerText=thisItem.bank.bank;
        $scope.selectBank=thisItem.bank;
        let LoanTermRange=document.querySelector("#LoanTermRange");
        let digitOfLoanTermRange=document.querySelector("#digitOfLoanTermRange");
        LoanTermRange.max=$scope.selectBank.LoanTermMax;
        LoanTermRange.min=$scope.selectBank.LoanTermMin;
        LoanTermRange.value=parseInt(($scope.selectBank.LoanTermMax+$scope.selectBank.LoanTermMin)/2);
        digitOfLoanTermRange.innerText=parseInt(($scope.selectBank.LoanTermMax+$scope.selectBank.LoanTermMin)/2).toString();
        
        inp1=document.querySelector("#formInitialLoan");
        inp2=document.querySelector("#formDownPayment");
        if(Number.isInteger(inp1.value)){
            inp2.value=parseFloat(inp1.value)/100*$scope.selectBank.MinimumDownPayment;
        }
        inp2.value=parseFloat(inp1.value)/100*$scope.selectBank.MinimumDownPayment;
    }
    // calculate formula
    $scope.calculate=function(InitialLoanInput,DownPaymentInput,LoanTermInput){
        let DownPaymentInput1=document.querySelector("#formDownPayment");
        DownPaymentInput=parseFloat(DownPaymentInput1.value);
        let P,r,t,n;
        P=InitialLoanInput-DownPaymentInput;
        r=$scope.selectBank.InterestRate;
        t=LoanTermInput;
        var i,
        koef,
        result;

        console.log(DownPaymentInput);

    // ставка в месяц
    i = (r / 12) / 100;
    // коэффициент аннуитета
    koef = (i * (Math.pow(1 + i, t * 12))) / (Math.pow(1 + i, t * 12) - 1);
    // итог
    result = P * koef;
    document.querySelector("#result").innerText=result.toFixed();

    }
});


// remove class table-primary
function removeClasTablePrimary(){
    var elms=document.getElementsByClassName("table-primary");
    for (const iterator of elms) {
        if(iterator.classList.contains("table-primary")){
            iterator.classList.remove("table-primary");
        }
    }
}



//display range input
// let el=document.querySelector("#LoanTermRange");
// el.addEventListener("input",function(){
//     let digitOfLoanTermRange=document.querySelector("#digitOfLoanTermRange");
//     digitOfLoanTermRange.innerText=el.value.toString();
// })


