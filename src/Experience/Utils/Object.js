export default class Debug
{
    constructor()
    {
        
    }

    /**
     * Check if an object is empty
     * 
     * @param object
     * @return boolean
     */
    isEmtpy(object)
    {
        for(let key in object)
        {
            return false
        }

        return true
    }
}