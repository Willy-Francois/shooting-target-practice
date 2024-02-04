const informationIcon = document.getElementsByClassName('gg-info')[0];
const explanationContainer = document.querySelector('.explanation-container-sequence');
let sequenceInfoIsEnable = false;
document.addEventListener('DOMContentLoaded', function () {
    informationIcon.addEventListener('click', () => {
        if(sequenceInfoIsEnable){
            explanationContainer.style.display = 'none';
            sequenceInfoIsEnable = false;
        }else{
            explanationContainer.style.display = 'block';
            sequenceInfoIsEnable = true;
        }

    });
});
