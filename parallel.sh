function parallel(){
 time xargs -P 3 -I {} sh -c 'eval "$1"' - {} &
 time xargs -P 3 -I {} sh -c 'eval "$2"' - {} 
}